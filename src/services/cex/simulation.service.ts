import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PricesService } from './prices.service';
import { IListenTicker, ISimulationResult, IWalletBalance, SimulationType } from '@/types/cex.types';
import { LoggerService } from '@/services/_logger.service';
import { mockCexBalances } from '@/constants/simulations';
@Injectable()
export class SimulationService {
  private readonly log = new Logger(SimulationService.name);
  private currentCexBalances: Record<string, IWalletBalance>;
  private totalFeesInQuote: Record<string, number> = {};
  private totalFeesInBase: Record<string, number> = {};

  constructor(
    private pricesService: PricesService,
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.currentCexBalances = JSON.parse(JSON.stringify(mockCexBalances));
  }

  private calculateTotalBalances(cexBalances: Record<string, IWalletBalance>): Record<string, number> {
    const totalBalances: Record<string, number> = {};
    Object.values(cexBalances).forEach((exchangeBalance) => {
      // Sum up each token across all exchanges
      Object.entries(exchangeBalance).forEach(([token, amount]) => {
        totalBalances[token] = (totalBalances[token] || 0) + amount;
      });
    });
    return totalBalances;
  }
  private filterBalancesBySymbol(
    balances: Record<string, IWalletBalance>,
    symbol: string,
  ): Record<string, IWalletBalance> {
    const [baseAsset, quoteAsset] = symbol.split('/');
    const filteredBalances: Record<string, IWalletBalance> = {};
    for (const exchange in balances) {
      if (balances.hasOwnProperty(exchange)) {
        const exchangeBalances = balances[exchange];
        filteredBalances[exchange] = {
          [baseAsset]: exchangeBalances[baseAsset],
          [quoteAsset]: exchangeBalances[quoteAsset],
        };
      }
    }
    return filteredBalances;
  }

  async simulationArbitrage(
    satisfiedResults: IListenTicker,
    simulationType: SimulationType,
  ): Promise<ISimulationResult> {
    const {
      symbol,
      minExchange,
      minPrice,
      maxExchange,
      maxPrice,
      diffPercentage,
      totalFeePct,
      minExFeePct,
      maxExFeePct,
    } = satisfiedResults;
    this.currentCexBalances = this.filterBalancesBySymbol(this.currentCexBalances, symbol);
    const results: ISimulationResult = {
      success: true,
      feeDeductionType: simulationType,
      currentCexBalances: this.currentCexBalances,
      simulationResults: {} as Record<string, Record<string, number | string>>,
      profitDetails: {} as Record<string, Record<string, number | string>>,
      warnings: [] as string[],
      totalCexBalances: {} as Record<string, number>,
      totalFeesInQuote: this.totalFeesInQuote,
      totalFeesInBase: this.totalFeesInBase,
    };
    try {
      const [baseAsset, quoteAsset] = symbol.split('/');
      const tradeAmount = this.configService.get('arbitrage_usdt_amount');

      // Validate buy side balances (minExchange)
      if (this.currentCexBalances[minExchange][quoteAsset] < tradeAmount) {
        results.warnings.push(
          `Insufficient ${quoteAsset} balance (${this.currentCexBalances[minExchange][quoteAsset]}) in ${minExchange} for buying. Required: ${tradeAmount}`,
        );
        return;
      }
      // Calculate buy/sell amounts
      const buyBaseAmount = tradeAmount / minPrice;
      const sellBaseAmount = tradeAmount / maxPrice;

      // Validate sell side balances (maxExchange)
      if (this.currentCexBalances[maxExchange][baseAsset] < sellBaseAmount) {
        results.warnings.push(
          `Insufficient ${baseAsset} balance (${this.currentCexBalances[maxExchange][baseAsset]}) in ${maxExchange} for selling. Required: ${sellBaseAmount}`,
        );
        return;
      }
      const grossProfit = buyBaseAmount - sellBaseAmount;
      if (simulationType === 'use-native') {
        // Calculate actual fees in quote asset (e.g., USDT)
        const buyFeeInQuote = tradeAmount * (minExFeePct / 100);
        const sellFeeInQuote = tradeAmount * (maxExFeePct / 100);
        const feesInQuote = buyFeeInQuote + sellFeeInQuote;
        this.totalFeesInQuote[symbol] = (this.totalFeesInQuote[symbol] || 0) + feesInQuote;

        // Update minExchange balances (buy)
        this.currentCexBalances[minExchange][quoteAsset] -= tradeAmount;
        this.currentCexBalances[minExchange][baseAsset] += buyBaseAmount;

        // Update maxExchange balances (sell)
        this.currentCexBalances[maxExchange][quoteAsset] += tradeAmount;
        this.currentCexBalances[maxExchange][baseAsset] -= sellBaseAmount;

        results.profitDetails[symbol] = {
          grossProfit: grossProfit,
          netProfitInQuote: grossProfit * minPrice - feesInQuote,
          feesInQuote,
          feesInBase: 0,
          accumulatedFeesInQuote: this.totalFeesInQuote[symbol],
          accumulatedFeesInBase: 0,
          pctFees: {
            totalFeePct: totalFeePct.toFixed(6),
            minExFee: {
              pct: minExFeePct.toFixed(6),
              exchange: minExchange,
            },
            maxExFee: {
              pct: maxExFeePct.toFixed(6),
              exchange: maxExchange,
            },
          },
          diffPercentage: diffPercentage.toFixed(6),
        };

        results.simulationResults[symbol] = {
          buySellAsset: baseAsset,
          buyBaseAssetAmount: buyBaseAmount,
          buyBaseAssetPrice: minPrice,
          sellBaseAssetAmount: sellBaseAmount,
          sellBaseAssetPrice: maxPrice,
        };
      } else if (simulationType === 'use-deducted') {
        // We will get less quote asset due to deducted fees
        const actualBuyBaseAmount = buyBaseAmount * (1 - minExFeePct / 100);
        const actualSellBaseAmount = sellBaseAmount * (1 - maxExFeePct / 100);
        const actualSellQuoteAmount = actualSellBaseAmount * maxPrice;
        const feesInQuote = tradeAmount - actualSellQuoteAmount;
        const feesInBase = buyBaseAmount - actualBuyBaseAmount;

        this.totalFeesInQuote[symbol] = (this.totalFeesInQuote[symbol] || 0) + feesInQuote;
        this.totalFeesInBase[symbol] = (this.totalFeesInBase[symbol] || 0) + feesInBase;

        // Update minExchange balances (buy)
        this.currentCexBalances[minExchange][quoteAsset] -= tradeAmount;
        this.currentCexBalances[minExchange][baseAsset] += actualBuyBaseAmount;

        // Update maxExchange balances (sell)
        this.currentCexBalances[maxExchange][baseAsset] -= sellBaseAmount;
        this.currentCexBalances[maxExchange][quoteAsset] += actualSellQuoteAmount;

        results.profitDetails[symbol] = {
          grossProfit: grossProfit,
          netProfitInQuote: grossProfit * minPrice - feesInQuote,
          feesInQuote,
          feesInBase,
          accumulatedFeesInQuote: this.totalFeesInQuote[symbol],
          accumulatedFeesInBase: this.totalFeesInBase[symbol],
          pctFees: {
            totalFeePct: totalFeePct.toFixed(6),
            minExFee: {
              pct: minExFeePct.toFixed(6),
              exchange: minExchange,
            },
            maxExFee: {
              pct: maxExFeePct.toFixed(6),
              exchange: maxExchange,
            },
          },
          diffPercentage: diffPercentage.toFixed(6),
        };

        results.simulationResults[symbol] = {
          buySellAsset: baseAsset,
          buyBaseAssetAmount: actualBuyBaseAmount,
          buyBaseAssetPrice: minPrice,
          sellBaseAssetAmount: actualSellBaseAmount,
          sellBaseAssetPrice: maxPrice,
        };
      }
      results.totalCexBalances = this.calculateTotalBalances(this.currentCexBalances);
      const dataSimulation = {
        [symbol]: JSON.stringify(results),
      };
      this.logger.logArbitrage(dataSimulation);
      return results;
    } catch (error) {
      this.log.error('Error in simulationArbitrage:', error);
      return {
        success: false,
        error: error?.message,
        feeDeductionType: simulationType,
        currentCexBalances: this.currentCexBalances,
        totalCexBalances: this.calculateTotalBalances(this.currentCexBalances),
        totalFeesInQuote: this.totalFeesInQuote,
        totalFeesInBase: this.totalFeesInBase,
      };
    }
  }
}

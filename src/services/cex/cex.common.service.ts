import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PricesService } from './prices.service';
import * as ccxt from 'ccxt';
import {
  ICurrencyInterface,
  IListenTicker,
  ISimulationResult,
  IWalletBalance,
  SimulationType,
  WalletType,
  WithdrawParams,
} from '@/types/cex.types';
import { mockCexBalances } from '@/constants/simulations';
@Injectable()
export class CexCommonService {
  private readonly log = new Logger(CexCommonService.name);
  private currentCexBalances: Record<string, IWalletBalance>;
  private totalFeesInQuote: Record<string, number> = {};
  private totalFeesInBase: Record<string, number> = {};

  constructor(
    private pricesService: PricesService,
    private configService: ConfigService,
  ) {
    this.currentCexBalances = JSON.parse(JSON.stringify(mockCexBalances));
  }

  async fetchCexBalance(exchange: ccxt.Exchange, symbol?: string[], type: WalletType = 'spot') {
    try {
      const balance = await exchange.fetchBalance({ type });
      if (symbol) {
        return {
          success: true,
          data: symbol.map((sym) => ({
            symbol: sym,
            type,
            free: balance[sym]?.free || 0,
            used: balance[sym]?.used || 0,
            total: balance[sym]?.total || 0,
          })),
        };
      }
      return {
        success: true,
        data: balance,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // get withdrawal info of a coin in that cex (withdrawal fees, minDeposit, maxDeposit, etc)
  async getInfoWithdrawalTokens(exchange: ccxt.Exchange, coin: string) {
    try {
      const currencies = await exchange.fetchCurrencies();
      const coinInfo = currencies[coin] as ICurrencyInterface;

      if (!coinInfo) {
        throw new Error(`Coin ${coin} not found`);
      }

      return {
        success: true,
        data: {
          coin,
          active: coinInfo.active,
          withdrawEnabled: coinInfo.withdraw,
          depositEnabled: coinInfo.deposit,
          withdrawalFees: coinInfo.fees,
          networks: coinInfo.networks,
          // coinInfo,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async withdrawCrypto(exchange: ccxt.Exchange, params: WithdrawParams) {
    try {
      // First verify if withdrawal is possible
      const withdrawInfo = await exchange.fetchCurrencies();
      const coinInfo = withdrawInfo[params.coin];

      if (!coinInfo || !coinInfo.active || !coinInfo.withdraw) {
        throw new Error(`Withdrawals for ${params.coin} are currently disabled`);
      }

      const networks = coinInfo.networks;
      let selectedNetwork = null;

      if (params.network) {
        selectedNetwork = networks[params.network];
        if (!selectedNetwork) {
          throw new Error(`Network ${params.network} not found for ${params.coin}`);
        }
      } else {
        selectedNetwork = Object.values(networks)[0];
      }

      // Check minimum withdrawal
      if (params.amount < selectedNetwork.withdrawMin) {
        throw new Error(
          `Amount ${params.amount} is below minimum withdrawal of ${selectedNetwork.withdrawMin} ${params.coin}`,
        );
      }

      const withdrawal = await exchange.withdraw(params.coin, params.amount, params.address, params.tag, {
        network: params.network,
        memo: params.memo,
        chain: params?.chain,
      });

      return {
        success: true,
        data: {
          id: withdrawal.id,
          txid: withdrawal.txid,
          amount: withdrawal.amount,
          fee: withdrawal.fee,
          network: params.network,
          status: withdrawal.status,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
  async orderQuoteToBase(exchange: ccxt.Exchange, symbol: string, quoteAmount: number, watchedBasePrice?: number) {
    try {
      // symbol: DOGE/USDT, quoteAmount: 10 USDT
      const markets = await exchange.loadMarkets();
      const market = markets[symbol];

      const ticker = await exchange.fetchTicker(symbol);
      const currentPrice = ticker.last;

      const baseAmount = quoteAmount / currentPrice;

      const notionalValue = baseAmount * currentPrice;
      if (notionalValue < market.limits.cost.min) {
        throw new Error(
          `Order value (${notionalValue} USDT) is below minimum notional value of ${market.limits.cost.min} USDT`,
        );
      }
      console.log('__ spotQuoteToBase: ', { watchedBasePrice, currentPrice, baseAmount, notionalValue });

      let order: any;
      if (exchange.id === 'bitget' || exchange.id === 'huobi') {
        order = await exchange.createOrder(symbol, 'market', 'buy', undefined, undefined, {
          cost: quoteAmount,
        });
      } else {
        order = await exchange.createMarketBuyOrder(symbol, baseAmount);
      }

      return {
        success: true,
        data: order,
      };
    } catch (error: any) {
      let errorMessage = 'An error occurred while placing the order.';
      if (error instanceof ccxt.BaseError) {
        errorMessage = `CCXT Error: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async orderBaseToQuote(exchange: ccxt.Exchange, symbol: string, baseAmount: number, watchedBasePrice?: number) {
    try {
      // symbol: DOGE/USDT, baseAmount: 10.12 DOGE
      const markets = await exchange.loadMarkets();
      const market = markets[symbol];

      const ticker = await exchange.fetchTicker(symbol);
      const currentPrice = ticker.last;

      const notionalValue = baseAmount * currentPrice;
      if (notionalValue < market.limits.cost.min) {
        throw new Error(
          `Order value (${notionalValue} USDT) is below minimum notional value of ${market.limits.cost.min} USDT`,
        );
      }
      console.log('__ spotBaseToQuote: ', { watchedBasePrice, currentPrice, baseAmount, notionalValue });
      let order: any;
      if (exchange.id === 'bitget') {
        order = await exchange.createOrder(symbol, 'market', 'sell', baseAmount);
      } else {
        order = await exchange.createMarketSellOrder(symbol, baseAmount);
      }

      return {
        success: true,
        data: order,
      };
    } catch (error: any) {
      let errorMessage = 'An error occurred while placing the order.';
      if (error instanceof ccxt.BaseError) {
        errorMessage = `CCXT Error: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
  private calculateTotalBalances(): Record<string, number> {
    const totalBalances: Record<string, number> = {};

    Object.values(this.currentCexBalances).forEach((exchangeBalance) => {
      // Sum up each token across all exchanges
      Object.entries(exchangeBalance).forEach(([token, amount]) => {
        totalBalances[token] = (totalBalances[token] || 0) + amount;
      });
    });

    return totalBalances;
  }

  async simulationArbitrage(
    satisfiedResults: IListenTicker[],
    simulationType: SimulationType,
  ): Promise<ISimulationResult> {
    const results: ISimulationResult = {
      success: true,
      data: this.currentCexBalances,
      simulationResults: {} as Record<string, Record<string, number | string>>,
      warnings: [] as string[],
      profitDetails: [] as string[],
      totalBalances: this.calculateTotalBalances(),
      totalFeesInQuote: this.totalFeesInQuote,
      totalFeesInBase: this.totalFeesInBase,
    };
    try {
      satisfiedResults.forEach((result) => {
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
        } = result;
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
        console.log('__ log calculation: ', { buyBaseAmount, sellBaseAmount, totalFeePct, minExFeePct, maxExFeePct });
        if (simulationType === 'use-native') {
          // Calculate actual fees in quote asset (e.g., USDT)
          const buyFeeInQuote = tradeAmount * (minExFeePct / 100);
          const sellFeeInQuote = tradeAmount * (maxExFeePct / 100);
          const totalFeeInQuote = buyFeeInQuote + sellFeeInQuote;
          this.totalFeesInQuote[symbol] = (this.totalFeesInQuote[symbol] || 0) + totalFeeInQuote;

          // Update minExchange balances (buy)
          this.currentCexBalances[minExchange][quoteAsset] -= tradeAmount;
          this.currentCexBalances[minExchange][baseAsset] += buyBaseAmount;

          // Update maxExchange balances (sell)
          this.currentCexBalances[maxExchange][quoteAsset] += tradeAmount;
          this.currentCexBalances[maxExchange][baseAsset] -= sellBaseAmount;

          const profitDetail =
            `Arbitrage ${symbol}: ` +
            `Gross profit: ${grossProfit} ${baseAsset} (${grossProfit * minPrice} ${quoteAsset}), ` +
            `Net profit in Quote: ${grossProfit * minPrice - (buyFeeInQuote + sellFeeInQuote)} ${quoteAsset}, ` +
            `Total fees in Quote: ${totalFeeInQuote} ${quoteAsset}, ` +
            `Accumulated fees in ${quoteAsset}: ${this.totalFeesInQuote[symbol]}, ` +
            `Total fees %: ${totalFeePct.toFixed(4)}%, ` +
            `Diff %: ${diffPercentage.toFixed(4)}%`;

          // const simulationResult =
          //   `Successful arbitrage: ${symbol}: ` +
          //   `Buy ${buyBaseAmount} ${baseAsset} at ${minPrice} ${quoteAsset} on ${minExchange}, ` +
          //   `Sell ${sellBaseAmount} ${baseAsset} at ${maxPrice} ${quoteAsset} on ${maxExchange} `;

          results.profitDetails.push(profitDetail);
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
          const actualSellQuoteAmount = sellBaseAmount * (1 - maxExFeePct / 100) * maxPrice;
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

          const profitDetail =
            `${symbol}: ` +
            `Gross profit: ${grossProfit} ${baseAsset}, ` +
            `Fees in base: ${feesInBase} ${baseAsset}, ` +
            `Fees in quote: ${feesInQuote} ${quoteAsset}, ` +
            `Diff %: ${diffPercentage.toFixed(4)}%, ` +
            `Total fees %: ${totalFeePct.toFixed(4)}%`;

          // const simulationResult =
          //   `Successful arbitrage: ${symbol}: ` +
          //   `Buy ${buyBaseAmount} ${baseAsset} at ${minPrice} on ${minExchange}, ` +
          //   `Sell ${sellBaseAmount} ${baseAsset} at ${maxPrice} on ${maxExchange}!`;

          results.profitDetails.push(profitDetail);
          results.simulationResults[symbol] = {
            buySellAsset: baseAsset,
            buyBaseAssetAmount: buyBaseAmount,
            buyBaseAssetPrice: minPrice,
            sellBaseAssetAmount: sellBaseAmount,
            sellBaseAssetPrice: maxPrice,
          };
        }
      });

      if (results.warnings.length > 0) {
        this.log.warn('Simulation warnings:', results.warnings);
      }

      results.totalBalances = this.calculateTotalBalances();
      return results;
    } catch (error) {
      this.log.error('Error in simulationArbitrage:', error);
      return {
        success: false,
        error: error.message,
        data: this.currentCexBalances,
        totalBalances: this.calculateTotalBalances(),
        totalFeesInQuote: this.totalFeesInQuote,
        totalFeesInBase: this.totalFeesInBase,
      };
    }
  }
}

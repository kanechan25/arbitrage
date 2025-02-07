import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PricesService } from './prices.service';
import * as ccxt from 'ccxt';
import {
  ICurrencyInterface,
  IListenTicker,
  ISimulationResult,
  IWalletBalance,
  WalletType,
  WithdrawParams,
} from '@/types/cex.types';
import { mockCexBalances } from '@/constants/simulations';
@Injectable()
export class CexCommonService {
  private readonly log = new Logger(CexCommonService.name);
  private currentCexBalances: Record<string, IWalletBalance>;

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

  async simulationArbitrage(satisfiedResults: IListenTicker[]): Promise<ISimulationResult> {
    const results: ISimulationResult = {
      success: true,
      data: this.currentCexBalances,
      simulationResults: [] as string[],
      warnings: [] as string[],
      totalBalances: this.calculateTotalBalances(),
    };
    try {
      satisfiedResults.forEach((result) => {
        const { symbol, minExchange, minPrice, maxExchange, maxPrice, diffPercentage } = result;
        const [baseAsset, quoteAsset] = symbol.split('/');
        const tradeAmount = 5; // Trading with 5 USDT

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
        // If we reach here, we have sufficient balances => proceed with the simulation
        // Update minExchange balances (buy)
        this.currentCexBalances[minExchange][quoteAsset] -= tradeAmount;
        this.currentCexBalances[minExchange][baseAsset] += buyBaseAmount;

        // Update maxExchange balances (sell)
        this.currentCexBalances[maxExchange][quoteAsset] += tradeAmount;
        this.currentCexBalances[maxExchange][baseAsset] -= sellBaseAmount;

        // Log successful arbitrage
        const simulationResult =
          `Successful arbitrage: ${symbol}: ` +
          `Buy ${buyBaseAmount.toFixed(8)} ${baseAsset} at ${minPrice} on ${minExchange}, ` +
          `Sell ${sellBaseAmount.toFixed(8)} ${baseAsset} at ${maxPrice} on ${maxExchange} (${diffPercentage.toFixed(4)}%)`;

        results.simulationResults.push(simulationResult);
      });
      if (results.warnings.length > 0) {
        this.log.warn('Simulation warnings:', results.warnings);
      }
      results.totalBalances = this.calculateTotalBalances();
      this.log.debug('Result:', results);
      return results;
    } catch (error) {
      this.log.error('Error in simulationArbitrage:', error);
      return {
        success: false,
        error: error.message,
        data: this.currentCexBalances,
        totalBalances: this.calculateTotalBalances(),
      };
    }
  }
}

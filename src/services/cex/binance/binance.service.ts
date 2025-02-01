import { binanceTransfer2 } from '@/config/wallets';
import { WalletType } from '@/types/cex.types';
import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { CexCommonService } from '@/services/cex/cex.common.service';
@Injectable()
export class BinanceService {
  private exchange: ccxt.binance;

  constructor(private cexCommonService: CexCommonService) {
    this.exchange = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_API_SECRET,
      enableRateLimit: true, // Helps to respect Binance's rate limits
    });
  }
  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    return await this.cexCommonService.fetchCexBalance(this.exchange, symbol, type);
  }
  async spotQuoteToBase(symbol: string, quoteAmount: number, watchedBasePrice: number) {
    try {
      // Get market info to check minimum notional
      const markets = await this.exchange.loadMarkets();
      const market = markets[symbol];

      const ticker = await this.exchange.fetchTicker(symbol);
      const currentPrice = ticker.last;

      const baseAmount = quoteAmount / currentPrice;
      // Check minimum notional (Binance requires min 5 USDT for most pairs)
      const notionalValue = baseAmount * currentPrice;
      if (notionalValue < market.limits.cost.min) {
        throw new Error(
          `Order value (${notionalValue} USDT) is below minimum notional value of ${market.limits.cost.min} USDT`,
        );
      }
      console.log('__ spotQuoteToBase: ', { watchedBasePrice, currentPrice, baseAmount, notionalValue });
      // const order = await this.exchange.createMarketBuyOrder(symbol, baseAmount);
      // return {
      //   success: true,
      //   data: order,
      // };
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

  async deposit2Wallets() {
    try {
      const results: Record<string, any> = {};
      await Promise.all(
        binanceTransfer2.map(async (wallet) => {
          if (wallet.amount > 0) {
            const withdrawResult = await this.cexCommonService.withdrawCrypto(this.exchange, {
              coin: wallet.coin,
              amount: wallet.amount,
              address: wallet.address,
              network: wallet.network,
            });
            results[wallet.platform] = withdrawResult;
          } else {
            results[wallet.platform] = {};
          }
        }),
      );
      return {
        success: true,
        error: null,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: {},
      };
    }
  }

  // get withdrawal info of a coin in that cex (withdrawal fees, minDeposit, maxDeposit, etc)
  async fetchWithdrawalInfo(coin: string) {
    return await this.cexCommonService.getInfoWithdrawalTokens(this.exchange, coin);
  }
}

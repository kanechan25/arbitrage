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

  async withdraw2Cex() {
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

  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    return await this.cexCommonService.fetchCexBalance(this.exchange, symbol, type);
  }

  // get withdrawal info of a coin in that cex (withdrawal fees, minDeposit, maxDeposit, etc)
  async fetchWithdrawalInfo(coin: string) {
    return await this.cexCommonService.getInfoWithdrawalTokens(this.exchange, coin);
  }

  async spotQuoteToBase(symbol: string, quoteAmount: number, watchedBasePrice?: number) {
    // minimum notional: Binance requires min 5 USDT for most pairs
    return await this.cexCommonService.orderQuoteToBase(this.exchange, symbol, quoteAmount, watchedBasePrice);
  }
}

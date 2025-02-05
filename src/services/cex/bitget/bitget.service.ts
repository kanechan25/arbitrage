import { WalletType } from '@/types/cex.types';
import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { CexCommonService } from '@/services/cex/cex.common.service';
import { bitgetTransfer2 } from '@/config/wallets';
@Injectable()
export class BitgetService {
  private exchange: ccxt.bitget;

  constructor(private cexCommonService: CexCommonService) {
    this.exchange = new ccxt.bitget({
      apiKey: process.env.BITGET_API_KEY,
      secret: process.env.BITGET_API_SECRET,
      password: process.env.BITGET_PASSWORD,
      enableRateLimit: true, // Helps to respect Bitget's rate limits
    });
  }

  async withdraw2Cex() {
    try {
      const results: Record<string, any> = {};
      await Promise.all(
        bitgetTransfer2.map(async (wallet) => {
          if (wallet.amount > 0) {
            const withdrawResult = await this.cexCommonService.withdrawCrypto(this.exchange, {
              coin: wallet.coin,
              amount: wallet.amount,
              address: wallet.address,
              network: wallet.network,
              chain: wallet.chain,
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

  async fetchWithdrawalInfo(coin: string) {
    return await this.cexCommonService.getInfoWithdrawalTokens(this.exchange, coin);
  }

  async spotQuoteToBase(symbol: string, quoteAmount: number, watchedBasePrice?: number) {
    // minimum notional: requires min 1 (just 01) USDT for most pairs
    return await this.cexCommonService.orderQuoteToBase(this.exchange, symbol, quoteAmount, watchedBasePrice);
  }
}

import { Injectable } from '@nestjs/common';
import { WalletType } from '@/types/cex.types';
import * as ccxt from 'ccxt';
import { CexCommonService } from '@/services/cex/cex.common.service';
import { mexcTransfer2 } from '@/config/wallets';

@Injectable()
export class MexcService {
  private exchange: ccxt.mexc;

  constructor(private cexCommonService: CexCommonService) {
    this.exchange = new ccxt.mexc({
      apiKey: process.env.MEXC_API_KEY,
      secret: process.env.MEXC_API_SECRET,
    });
  }

  async withdraw2Cex() {
    try {
      const results: Record<string, any> = {};
      await Promise.all(
        mexcTransfer2.map(async (wallet) => {
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
    // spot of bybit is Unified Trading
    return await this.cexCommonService.fetchCexBalance(this.exchange, symbol, type);
  }

  async fetchWithdrawalInfo(coin: string) {
    return await this.cexCommonService.getInfoWithdrawalTokens(this.exchange, coin);
  }

  async spotQuoteToBase(symbol: string, quoteAmount: number, watchedBasePrice?: number) {
    // minimum notional: mexc requires min 1 (just 01) USDT for most pairs
    return await this.cexCommonService.orderQuoteToBase(this.exchange, symbol, quoteAmount, watchedBasePrice);
  }
}

import { WalletType } from '@/types/cex.types';
import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { CexCommonService } from '@/services/cex/cex.service';
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

  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    return await this.cexCommonService.fetchCexBalance(this.exchange, symbol, type);
  }

  async fetchWithdrawalInfo(coin: string) {
    return await this.cexCommonService.getInfoWithdrawalTokens(this.exchange, coin);
  }
}

import { Injectable } from '@nestjs/common';
import { WalletType } from '@/types/cex.types';
import * as ccxt from 'ccxt';
import { CexCommonService } from '@/services/cex/cex.service';

@Injectable()
export class BybitService {
  private exchange: ccxt.bybit;

  constructor(private cexCommonService: CexCommonService) {
    this.exchange = new ccxt.bybit({
      apiKey: process.env.BYBIT_API_KEY,
      secret: process.env.BYBIT_API_SECRET,
    });
  }

  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    // spot of bybit is Unified Trading
    return await this.cexCommonService.fetchCexBalance(this.exchange, symbol, type);
  }

  async fetchWithdrawalInfo(coin: string) {
    return await this.cexCommonService.getInfoWithdrawalTokens(this.exchange, coin);
  }
}

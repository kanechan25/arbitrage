import { WalletType } from '@/types/cex.types';
import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { CexCommonService } from '@/services/cex/cex.service';

@Injectable()
export class OkxService {
  private exchange: ccxt.okx;

  constructor(private cexCommonService: CexCommonService) {
    this.exchange = new ccxt.okx({
      apiKey: process.env.OKX_API_KEY,
      secret: process.env.OKX_API_SECRET,
      password: process.env.OKX_PASSWORD,
      enableRateLimit: true,
    });
  }

  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    return await this.cexCommonService.fetchCexBalance(this.exchange, symbol, type);
  }
  // get withdrawal info of a coin in that cex (withdrawal fees, minDeposit, maxDeposit, etc)
  async fetchWithdrawalInfo(coin: string) {
    return await this.cexCommonService.getInfoWithdrawalTokens(this.exchange, coin);
  }
}

import { WalletType } from '@/types/cex.types';
import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { PricesService } from '@/services/cex/prices.service';

@Injectable()
export class OkxService {
  private exchange: ccxt.okx;

  constructor(private pricesService: PricesService) {
    this.exchange = new ccxt.okx({
      apiKey: process.env.OKX_API_KEY,
      secret: process.env.OKX_API_SECRET,
      password: process.env.OKX_PASSWORD,
      enableRateLimit: true,
    });
  }

  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    return await this.pricesService.fetchCexBalance(this.exchange, symbol, type);
  }
}

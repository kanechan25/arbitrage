import { Injectable } from '@nestjs/common';
import { WalletType } from '@/types/cex.types';
import * as ccxt from 'ccxt';
import { PricesService } from '@/services/cex/prices.service';

@Injectable()
export class BybitService {
  private exchange: ccxt.bybit;

  constructor(private pricesService: PricesService) {
    this.exchange = new ccxt.bybit({
      apiKey: process.env.BYBIT_API_KEY,
      secret: process.env.BYBIT_API_SECRET,
    });
  }

  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    // spot of bybit is Unified Trading
    return await this.pricesService.fetchCexBalance(this.exchange, symbol, type);
  }
}

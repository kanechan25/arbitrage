import { WalletType } from '@/types/cex.types';
import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class OkxService {
  private exchange: ccxt.okx;

  constructor() {
    this.exchange = new ccxt.okx({
      apiKey: process.env.OKX_API_KEY,
      secret: process.env.OKX_API_SECRET,
      password: process.env.OKX_PASSWORD,
      enableRateLimit: true,
    });
  }

  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    try {
      const balance = await this.exchange.fetchBalance({ type });
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
}

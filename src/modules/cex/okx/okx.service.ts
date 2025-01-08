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
    });
  }

  async fetchBalance(symbol?: string) {
    try {
      const balance = await this.exchange.fetchBalance();
      if (symbol) {
        return {
          success: true,
          data: balance[symbol] || { free: 0, used: 0, total: 0 },
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

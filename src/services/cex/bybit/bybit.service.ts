import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class BybitService {
  private exchange: ccxt.bybit;

  constructor() {
    this.exchange = new ccxt.bybit({
      apiKey: process.env.BYBIT_API_KEY,
      secret: process.env.BYBIT_API_SECRET,
    });
  }

  async fetchBalance(symbol?: string[]) {
    try {
      const balance = await this.exchange.fetchBalance();
      if (symbol) {
        return {
          success: true,
          data: symbol.map((sym) => balance[sym] || { free: 0, used: 0, total: 0 }),
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

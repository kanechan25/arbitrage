import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class BinanceService {
  private exchange: ccxt.binance;

  constructor() {
    this.exchange = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_SECRET_KEY,
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

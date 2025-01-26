import { WalletType } from '@/types/cex.types';
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

  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    // spot of bybit is Unified Trading
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

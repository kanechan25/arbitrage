import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class BinanceService {
  private exchange: ccxt.binance;

  constructor() {
    this.exchange = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_API_SECRET,
      enableRateLimit: true, // Helps to respect Binance's rate limits
    });
  }
  private roundDown(num: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.floor(num * factor) / factor;
  }
  async fetchBalance(symbol?: string[]) {
    try {
      const balance = await this.exchange.fetchBalance();
      if (symbol && symbol.length === 1) {
        return {
          success: true,
          data: balance[symbol[0]] || { free: 0, used: 0, total: 0 },
        };
      }
      if (symbol && symbol.length > 1) {
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
  async convertQuoteToBase(symbol: string, quoteUsdtAmount: number) {
    try {
      // Get market info to check minimum notional
      const markets = await this.exchange.loadMarkets();
      const market = markets[symbol];

      // Get current price
      const ticker = await this.exchange.fetchTicker(symbol);
      const currentPrice = ticker.last;

      // Calculate base amount
      const baseAmount = quoteUsdtAmount / currentPrice;
      // Check minimum notional (Binance requires min 5 USDT for most pairs)
      const notionalValue = baseAmount * currentPrice;
      if (notionalValue < market.limits.cost.min) {
        throw new Error(
          `Order value (${notionalValue} USDT) is below minimum notional value of ${market.limits.cost.min} USDT`,
        );
      }
      const order = await this.exchange.createMarketBuyOrder(symbol, baseAmount);
      return {
        success: true,
        data: order,
      };
    } catch (error: any) {
      // Enhanced error handling
      let errorMessage = 'An error occurred while placing the order.';

      if (error instanceof ccxt.BaseError) {
        // Handle CCXT-specific errors
        errorMessage = `CCXT Error: ${error.message}`;
      } else if (error instanceof Error) {
        // Handle general errors
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

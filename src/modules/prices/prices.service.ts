import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ccxt from 'ccxt';

@Injectable()
export class PricesService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PricesService.name);
  private exchanges: Map<string, ccxt.Exchange> = new Map();
  private isWatching = false;

  constructor(private configService: ConfigService) {
    // Initialize exchanges from config
    const exchangesConfig = this.configService.get('exchanges');

    for (const exchange of exchangesConfig) {
      this.exchanges.set(
        exchange.name,
        new ccxt.pro[exchange.name]({
          apiKey: exchange.apiKey,
          secret: exchange.apiSecret,
          enableRateLimit: true,
        }),
      );
    }
  }

  async onModuleInit() {
    await this.startWatching();
  }

  async onModuleDestroy() {
    this.isWatching = false;
    // Close all exchange connections
    for (const exchange of this.exchanges.values()) {
      await exchange.close();
    }
  }

  async startWatching() {
    this.isWatching = true;
    const symbol = this.configService.get('symbol');
    const symbols = [symbol];

    try {
      while (this.isWatching) {
        const tickerPromises = Array.from(this.exchanges.entries()).map(async ([exchangeName, exchange]) => {
          try {
            const tickers = await exchange.watchTickers(symbols);
            this.logger.debug(`${exchangeName} tickers:`, tickers[symbol]);
            return {
              exchange: exchangeName,
              ticker: tickers[symbol],
            };
          } catch (error) {
            this.logger.error(`Error watching ${exchangeName} tickers:`, error);
            return null;
          }
        });

        const results = await Promise.all(tickerPromises);
        const validResults = results.filter((result) => result !== null);

        if (validResults.length > 0) {
          this.analyzePrices(validResults);
        }

        // Optional: Add delay between iterations
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      this.logger.error('Error in price watching loop:', error);
    }
  }

  private analyzePrices(results: any[]) {
    // Example price analysis
    const priceMap = new Map();

    results.forEach((result) => {
      if (result.ticker) {
        priceMap.set(result.exchange, result.ticker.last);
      }
    });

    if (priceMap.size >= 2) {
      const prices = Array.from(priceMap.values());
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const priceDiff = maxPrice - minPrice;
      const diffPercentage = (priceDiff / minPrice) * 100;

      const configuredDiff = this.configService.get('usdt_price_diff');

      if (diffPercentage > configuredDiff) {
        this.logger.log(`Price difference opportunity: ${diffPercentage.toFixed(2)}%`);
        // Here you could implement your trading logic or notifications
      }
    }
  }

  stopWatching() {
    this.isWatching = false;
  }
}

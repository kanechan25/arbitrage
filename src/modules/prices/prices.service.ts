import { ITicker } from '@/types';
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
        new ccxt[exchange.name]({
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

    try {
      while (this.isWatching) {
        const tickerPromises = Array.from(this.exchanges.entries()).map(
          async ([exchangeName, exchange]): Promise<ITicker | null> => {
            try {
              const ticker = await exchange.fetchTicker(symbol);
              if (!ticker || !ticker.last) {
                this.logger.warn(`No valid ticker data for ${symbol} on ${exchangeName}`);
                return null;
              }

              this.logger.log(`${symbol}: ${ticker.last} : ${exchangeName}`);
              return {
                exchange: exchangeName,
                ticker: ticker,
                timestamp: ticker.timestamp,
                last: ticker.last,
              };
            } catch (error) {
              this.logger.error(`Error fetching ${symbol} ticker from ${exchangeName}: ${error.message}`);
              return null;
            }
          },
        );

        const results = await Promise.all(tickerPromises);
        const validResults = results.filter((result): result is ITicker => result !== null);
        // this.logger.log('validResults: ', validResults);
        if (validResults.length > 0) {
          this.analyzePrices(validResults);
        } else {
          this.logger.warn('No valid ticker data received from any exchange');
        }

        const delay = this.configService.get('fetch_ticker_delay') || 3000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      this.logger.error('Error in price watching loop:', error);
      this.isWatching = false;
    }
  }

  private analyzePrices(results: ITicker[]) {
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
      this.logger.log(`Price difference opportunity: ${priceDiff} (${diffPercentage.toFixed(4)}%)`);

      const configuredDiff = this.configService.get('usdt_price_diff');

      if (priceDiff > configuredDiff) {
        // this.logger.log(`Have an opportunity!!!`);
      }
    }
  }

  stopWatching() {
    this.isWatching = false;
  }
}

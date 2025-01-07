import { ITicker } from '@/types';
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ccxt from 'ccxt';

@Injectable()
export class PricesService implements OnModuleInit, OnModuleDestroy {
  private recentTicks: ITicker[] = [];
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

              const tickData = {
                exchange: exchangeName,
                ticker: ticker,
                timestamp: ticker.timestamp,
                last: ticker.last,
              };
              // // Store the tick keep only last 100 ticks
              this.recentTicks.push(tickData);
              if (this.recentTicks.length > 100) {
                this.recentTicks.shift();
              }
              this.logger.log(`${symbol}: ${ticker.last} : ${exchangeName}`);
              return tickData;
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
    // Create price entries from results
    const priceEntries = results
      .filter((result) => result.ticker?.last)
      .map((result) => [result.exchange, result.ticker.last] as const);

    if (priceEntries.length >= 2) {
      // Find min and max prices with their exchanges in a single pass
      const { minExchange, minPrice, maxExchange, maxPrice } = priceEntries.reduce(
        (acc, [exchange, price]) => ({
          minExchange: price < acc.minPrice ? exchange : acc.minExchange,
          minPrice: Math.min(price, acc.minPrice),
          maxExchange: price > acc.maxPrice ? exchange : acc.maxExchange,
          maxPrice: Math.max(price, acc.maxPrice),
        }),
        {
          minExchange: priceEntries[0][0],
          minPrice: priceEntries[0][1],
          maxExchange: priceEntries[0][0],
          maxPrice: priceEntries[0][1],
        },
      );

      const priceDiff = maxPrice - minPrice;
      const diffPercentage = (priceDiff / minPrice) * 100;

      this.logger.log(`minPrice: (${minPrice}) (${minExchange}) | maxPrice: (${maxPrice}) (${maxExchange})`);
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
  public getRecentTicks(): ITicker[] {
    return this.recentTicks;
  }
}

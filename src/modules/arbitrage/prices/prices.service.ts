import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ccxt from 'ccxt';
import { IMultiTickers, ITicker, ITickerRecords } from '@/types';

@Injectable()
export class PricesService {
  private recentTicks: ITicker[] = [];
  private readonly logger = new Logger(PricesService.name);

  constructor(private configService: ConfigService) {}

  async fetchMultipleTickers(exchanges: Map<string, ccxt.Exchange>, symbols: string[]): Promise<ITickerRecords[]> {
    const tickerPromises = Array.from(exchanges.entries()).map(
      async ([exchangeName, exchange]): Promise<IMultiTickers> => {
        try {
          const tickers = await exchange.fetchTickers(symbols);
          if (!tickers) {
            this.logger.warn(`No valid ticker data on ${exchangeName}`);
            return null;
          }
          const tickData: IMultiTickers = {
            exchange: exchangeName,
            tickers,
          };
          return tickData;
        } catch (error) {
          this.logger.error(`Error fetching ticker from ${exchangeName}: ${error.message}`);
          return null;
        }
      },
    );

    const results = await Promise.all(tickerPromises);
    const fulfillResults = results.filter((result): result is IMultiTickers => result !== null);
    const validResults: ITickerRecords[] = symbols.map((symbol) => ({
      [symbol]: fulfillResults.map((result) => ({
        exchange: result.exchange,
        ticker: result.tickers[symbol],
        timestamp: result.tickers[symbol].timestamp,
        last: result.tickers[symbol].last,
      })),
    }));

    if (validResults.length > 0) {
      validResults.map((validResult) => {
        Object.values(validResult).map((results) => {
          this.analyzePrices(results);
        });
      });
    } else {
      this.logger.warn('No valid ticker data received from any exchange');
    }
    await this.delay();
    return validResults;
  }

  async fetchSingleTicker(exchanges: Map<string, ccxt.Exchange>, symbol: string): Promise<ITicker[]> {
    const tickerPromises = Array.from(exchanges.entries()).map(async ([exchangeName, exchange]): Promise<ITicker> => {
      try {
        const ticker = await exchange.fetchTicker(symbol);
        if (!ticker || !ticker.last) {
          this.logger.warn(`No valid ticker data for ${symbol} on ${exchangeName}`);
          return null;
        }
        const tickData: ITicker = {
          exchange: exchangeName,
          ticker: ticker,
          timestamp: ticker.timestamp,
          last: ticker.last,
        };
        return tickData;
      } catch (error) {
        this.logger.error(`Error fetching ${symbol} ticker from ${exchangeName}: ${error.message}`);
        return null;
      }
    });

    const results = await Promise.all(tickerPromises);
    const validResults = results.filter((result): result is ITicker => result !== null);
    // this.logger.log('validResults: ', validResults);
    if (validResults.length > 0) {
      this.analyzePrices(validResults);
    } else {
      this.logger.warn('No valid ticker data received from any exchange');
    }
    await this.delay();
    return validResults;
  }

  private storeTickData(tickData: ITicker): void {
    this.recentTicks.push(tickData);
    if (this.recentTicks.length > 100) {
      this.recentTicks.shift();
    }
  }

  private async delay(): Promise<void> {
    const delay_min: number = this.configService.get('fetch_delay_min');
    const delay_max: number = this.configService.get('fetch_delay_max');
    const delay = Math.floor(Math.random() * (delay_max - delay_min)) + delay_min;
    this.logger.log(`____________________________________delay: ${delay}`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  private analyzePrices(results: ITicker[]) {
    const priceEntries = results
      .filter((result) => result.ticker?.last)
      .map((result) => [result.exchange, result.ticker.symbol, result.ticker.last] as const);

    if (priceEntries.length >= 2) {
      const { symbol, minExchange, minPrice, maxExchange, maxPrice } = priceEntries.reduce(
        (acc, [exchange, symbol, price]) => ({
          symbol: symbol,
          minExchange: price < acc.minPrice ? exchange : acc.minExchange,
          minPrice: Math.min(price, acc.minPrice),
          maxExchange: price > acc.maxPrice ? exchange : acc.maxExchange,
          maxPrice: Math.max(price, acc.maxPrice),
        }),
        {
          symbol: priceEntries[0][1],
          minExchange: priceEntries[0][0],
          minPrice: priceEntries[0][2],
          maxExchange: priceEntries[0][0],
          maxPrice: priceEntries[0][2],
        },
      );

      const priceDiff = maxPrice - minPrice;
      const diffPercentage = (priceDiff / minPrice) * 100;

      this.logger.log(` ${symbol}: Min: (${minPrice}) (${minExchange}) | Max: (${maxPrice}) (${maxExchange})`);
      this.logger.log(`Price difference opportunity: ${priceDiff} (${diffPercentage.toFixed(4)}%)`);

      const configuredDiff = this.configService.get('usdt_price_diff');

      if (priceDiff > configuredDiff) {
        return {
          symbol,
          minExchange,
          minPrice,
          maxExchange,
          maxPrice,
          priceDiff,
          diffPercentage,
        };
      }
    }
  }

  public getRecentTicks(): ITicker[] {
    return this.recentTicks;
  }
}

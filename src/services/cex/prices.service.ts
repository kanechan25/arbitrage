import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ccxt from 'ccxt';
import { LoggerService } from '@/services/_logger.service';
import { IListenTicker, IMultiTickers, ITicker, ITickerRecords } from '@/types/cex';

@Injectable()
export class PricesService {
  private recentTicks: ITicker[] = [];

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {}

  async fetchMultipleTickers(exchanges: Map<string, ccxt.Exchange>, symbols: string[]): Promise<ITickerRecords[]> {
    const tickerPromises = Array.from(exchanges.entries()).map(
      async ([exchangeName, exchange]): Promise<IMultiTickers> => {
        try {
          const tickers = await exchange.fetchTickers(symbols);
          if (!tickers) {
            this.logger.logWarning(`No valid ticker data on ${exchangeName}`);
            return null;
          }
          const tickData: IMultiTickers = {
            exchange: exchangeName,
            tickers,
          };
          return tickData;
        } catch (error) {
          this.logger.logError(error, `Error fetching ticker from ${exchangeName}: ${error.message}`);
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
      this.logger.logWarning('No valid ticker data received from any exchange');
    }
    return validResults;
  }

  async fetchSingleTicker(exchanges: Map<string, ccxt.Exchange>, symbol: string): Promise<IListenTicker | null> {
    const tickerPromises = Array.from(exchanges.entries()).map(async ([exchangeName, exchange]): Promise<ITicker> => {
      try {
        const ticker = await exchange.fetchTicker(symbol);
        if (!ticker || !ticker.last) {
          this.logger.logWarning(`No valid ticker data for ${symbol} on ${exchangeName}`);
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
        this.logger.logError(error, `Error fetching ${symbol} ticker from ${exchangeName}: ${error.message}`);
        return null;
      }
    });

    const results = await Promise.all(tickerPromises);
    const validResults = results.filter((result): result is ITicker => result !== null);
    // this.logger.log('validResults: ', validResults);
    if (validResults.length > 0) {
      return this.analyzePrices(validResults);
    } else {
      this.logger.logWarning('No valid ticker data received from any exchange');
      return null;
    }
  }

  private analyzePrices(results: ITicker[]): IListenTicker | null {
    const priceEntries = results
      .filter((result) => result.ticker?.last)
      .map((result) => ({
        exchange: result.exchange,
        symbol: result.ticker.symbol,
        price: result.ticker.last,
      }));

    if (priceEntries.length >= 2) {
      const { symbol, minExchange, minPrice, maxExchange, maxPrice } = priceEntries.reduce(
        (acc, entry) => ({
          symbol: entry.symbol,
          minExchange: entry.price < acc.minPrice ? entry.exchange : acc.minExchange,
          minPrice: Math.min(entry.price, acc.minPrice),
          maxExchange: entry.price > acc.maxPrice ? entry.exchange : acc.maxExchange,
          maxPrice: Math.max(entry.price, acc.maxPrice),
        }),
        {
          symbol: priceEntries[0].symbol,
          minExchange: priceEntries[0].exchange,
          minPrice: priceEntries[0].price,
          maxExchange: priceEntries[0].exchange,
          maxPrice: priceEntries[0].price,
        },
      );

      const priceDiff = maxPrice - minPrice;
      const diffPercentage = (priceDiff / minPrice) * 100;

      this.logger.logInfo(` ${symbol}: Min: ${minPrice} (${minExchange}) | Max: ${maxPrice} (${maxExchange})`);
      this.logger.logInfo(`Price difference opportunity: ${priceDiff} (${diffPercentage.toFixed(4)}%)`);
      const exchangePrices = priceEntries.reduce(
        (acc, entry) => ({
          ...acc,
          [entry.exchange]: entry.price,
        }),
        {},
      );
      this.logger.logPrices({
        symbol,
        minPrice,
        maxPrice,
        minExchange,
        maxExchange,
        priceDiff,
        diffPercentage: Number(diffPercentage.toFixed(4)),
        ...exchangePrices,
      });
      const configUsdtDiff = this.configService.get('usdt_price_diff')[symbol];

      if (priceDiff > configUsdtDiff) {
        return {
          symbol,
          minExchange,
          minPrice,
          maxExchange,
          maxPrice,
          priceDiff,
          diffPercentage,
          ...exchangePrices,
        };
      }
    }
    return null;
  }
  private storeTickData(tickData: ITicker): void {
    this.recentTicks.push(tickData);
    if (this.recentTicks.length > 100) {
      this.recentTicks.shift();
    }
  }

  public getRecentTicks(): ITicker[] {
    return this.recentTicks;
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ccxt from 'ccxt';
import { LoggerService } from '@/services/_logger.service';
import {
  IListenTicker,
  IMultiTickers,
  ITicker,
  ITickerRecords,
  IExchangeAnalysis,
  SimulationType,
} from '@/types/cex.types';
import { analyzeExchangeLog } from '@/services/_exchangeStats';
import { calculateSpotFees } from '@/utils';
@Injectable()
export class PricesService {
  private recentTicks: ITicker[] = [];

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {}
  /* params for fetchTickers:
    limit?: number,        // Maximum number of tickers to return
    type?: string,        // Market type
    settle?: string,      // Settlement currency
    price?: string,       // Price type: 'mark', 'index', 'spot', etc.
    method?: string,      // HTTP method override
    timeout?: number,     // Custom timeout in milliseconds
  */
  async fetch_findOp_log_Tickers(
    exchanges: Map<string, ccxt.Exchange>,
    symbols: string[],
    simulationType: SimulationType,
    isLogger: boolean,
  ): Promise<IListenTicker[] | null> {
    const tickerPromises = Array.from(exchanges.entries()).map(
      async ([exchangeName, exchange]): Promise<IMultiTickers> => {
        try {
          const tickers = await exchange.fetchTickers(symbols, {
            type: 'spot',
          });
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
    return await this.findOp_log_tickers(validResults, simulationType, isLogger);
  }

  private async findOp_log_tickers(
    fetchPriceResults: ITickerRecords[],
    simulationType: SimulationType,
    isLogger: boolean = false,
  ): Promise<IListenTicker[] | null> {
    if (fetchPriceResults.length > 0) {
      const results = fetchPriceResults
        .map((validResult) => {
          return Object.values(validResult).map((results) => this.analyzePrices(results, simulationType, isLogger))[0];
        })
        .filter((result): result is IListenTicker => result !== null);
      return results.length > 0 ? results : null;
    } else {
      this.logger.logWarning('No valid ticker data received from any exchange');
      return null;
    }
  }

  // fetchSingleTicker deprecated 25 Jan 2025, deleted 30 Jan 2025

  private analyzePrices(
    results: ITicker[],
    simulationType: SimulationType,
    isLogger: boolean = false,
  ): IListenTicker | null {
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

      const exchangePrices = priceEntries.reduce(
        (acc, entry) => ({
          ...acc,
          [entry.exchange]: entry.price,
        }),
        {},
      );
      // If the price difference is greater than the configured minimum profit percentage, return the opportunity
      const { totalFeePct, minExFeePct, maxExFeePct } = calculateSpotFees({
        minExchange,
        maxExchange,
        spotFeeType: simulationType === 'use-native' ? 'discounted' : 'default',
        symbol,
      });
      if (isLogger) {
        this.logger.logPrices({
          symbol,
          minPrice,
          maxPrice,
          minExchange,
          maxExchange,
          priceDiff,
          diffPercentage: Number(diffPercentage.toFixed(6)),
          totalFeePct,
          minExFeePct,
          maxExFeePct,
          ...exchangePrices,
        });
      }

      if (diffPercentage > totalFeePct) {
        return {
          symbol,
          minExchange,
          minPrice,
          maxExchange,
          maxPrice,
          priceDiff,
          diffPercentage,
          totalFeePct,
          minExFeePct,
          maxExFeePct,
          ...exchangePrices,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  async delay(): Promise<void> {
    const delay_min: number = this.configService.get('fetch_delay_min');
    const delay_max: number = this.configService.get('fetch_delay_max');
    const delay = Math.floor(Math.random() * (delay_max - delay_min)) + delay_min;
    this.logger.logInfo(`____________________________________delay: ${delay}`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private storeTickData(tickData: ITicker): void {
    this.recentTicks.push(tickData);
    if (this.recentTicks.length > 100) {
      this.recentTicks.shift();
    }
  }
  async analyzeExchangeLog(logFilePaths: string[], isCheckExchange: boolean = false): Promise<IExchangeAnalysis[]> {
    const analysisPromises = logFilePaths.map(async (logFilePath) => {
      const analysis = await analyzeExchangeLog(logFilePath);
      if (isCheckExchange) {
        return analysis;
      }
      return { ...analysis, exchanges: {} };
    });
    return Promise.all(analysisPromises);
  }

  public getRecentTicks(): ITicker[] {
    return this.recentTicks;
  }
}

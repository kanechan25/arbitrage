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
  WalletType,
} from '@/types/cex.types';
import { analyzeExchangeLog } from '@/services/_exchangeStats';
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
    return await this.findOp_log_tickers(validResults, isLogger);
  }

  private async findOp_log_tickers(
    fetchPriceResults: ITickerRecords[],
    isLogger: boolean = false,
  ): Promise<IListenTicker[] | null> {
    if (fetchPriceResults.length > 0) {
      const results = fetchPriceResults
        .map((validResult) => {
          return Object.values(validResult).map((results) => this.analyzePrices(results, isLogger))[0];
        })
        .filter((result): result is IListenTicker => result !== null);
      return results.length > 0 ? results : null;
    } else {
      this.logger.logWarning('No valid ticker data received from any exchange');
      return null;
    }
  }

  // TODO: fetchSingleTicker deprecated 25 Jan 2025
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

  private analyzePrices(results: ITicker[], isLogger: boolean = false): IListenTicker | null {
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
      const exchangePrices = priceEntries.reduce(
        (acc, entry) => ({
          ...acc,
          [entry.exchange]: entry.price,
        }),
        {},
      );
      if (isLogger) {
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
      }
      // If the price difference is greater than the configured minimum profit percentage, return the opportunity
      const configProfitPctDiff = this.configService.get('min_profit_percentage')[symbol];
      if (diffPercentage > configProfitPctDiff) {
        // this.logger.logInfo(`____FOUND out an opportunity: ${priceDiff} (${diffPercentage.toFixed(4)}%)`);
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
      } else {
        // this.logger.logInfo(`_______NO opportunity found: ${priceDiff} (${diffPercentage.toFixed(4)}%)`);
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
      const analysis = await analyzeExchangeLog(logFilePath, this.configService);
      if (isCheckExchange) {
        return analysis;
      }
      return { ...analysis, exchanges: {} };
    });
    return Promise.all(analysisPromises);
  }
  async fetchCexBalance(exchange: ccxt.Exchange, symbol?: string[], type: WalletType = 'spot') {
    try {
      const balance = await exchange.fetchBalance({ type });
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
  public getRecentTicks(): ITicker[] {
    return this.recentTicks;
  }
}

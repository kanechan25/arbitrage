import { IListenTicker } from '@/types/cex.types';
import { createLogger, transports, format } from 'winston';
import { ConfigService } from '@nestjs/config';
import { calculateAverageTime, calculateTimeDifference } from '@/utils';

export interface IExchangeStats {
  maxExCount: number;
  maxExPct: number;
  minExCount: number;
  minExPct: number;
}

export interface IExchangeAnalysis {
  totalRows: number;
  exchanges: {
    [key: string]: IExchangeStats;
  };
  startTimestamp: number | string;
  endTimestamp: number | string;
  duration: string;
  satisfiedPctCount: number;
  averageSatisfiedTime: string;
  symbol: string;
}

export async function analyzeExchangeLog(
  logFilePath: string,
  configService: ConfigService,
): Promise<IExchangeAnalysis> {
  // Create a Winston logger instance
  const logger = createLogger({
    transports: [
      new transports.File({
        filename: logFilePath,
        format: format.json(),
      }),
    ],
  });
  // Initialize result object
  const result: IExchangeAnalysis = {
    totalRows: 0,
    exchanges: {
      binance: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      bitget: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      bybit: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      gateio: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      huobi: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      kucoin: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      lbank: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      mexc: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      okx: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
    },
    startTimestamp: '',
    endTimestamp: '',
    duration: '',
    satisfiedPctCount: 0,
    averageSatisfiedTime: '',
    symbol: '',
  };
  const configUsdtDiff = configService.get('min_profit_percentage');
  return new Promise((resolve, reject) => {
    logger.query(
      {
        limit: 1000000,
        from: new Date(0),
        until: new Date(),
        order: 'asc',
        fields: ['maxExchange', 'minExchange', 'diffPercentage', 'timestamp', 'symbol'],
      },
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        const logEntries = results.file || [];
        for (const entry of logEntries) {
          try {
            // Debug log to see the raw entry
            let data: IListenTicker;
            if (typeof entry === 'string') {
              data = JSON.parse(entry);
            } else if (entry.message) {
              data = typeof entry.message === 'string' ? JSON.parse(entry.message) : entry.message;
            } else {
              data = entry;
            }

            if (data && data?.maxExchange && data?.minExchange) {
              if (data.diffPercentage && data.diffPercentage > configUsdtDiff) {
                result.satisfiedPctCount++;
              }
              if (result.exchanges[data?.maxExchange]) {
                result.exchanges[data?.maxExchange].maxExCount++;
              }
              if (result.exchanges[data?.minExchange]) {
                result.exchanges[data?.minExchange].minExCount++;
              }
            }
          } catch (error) {
            console.error('Error processing log entry:', error);
            console.error('Problematic entry:', entry);
          }
        }

        result.symbol = logEntries[logEntries.length - 1]?.symbol;
        result.totalRows = logEntries.length;
        result.startTimestamp = logEntries[0]?.timestamp;
        result.endTimestamp = logEntries[logEntries.length - 1]?.timestamp;
        result.duration = calculateTimeDifference(result.endTimestamp.toString(), result.startTimestamp.toString());
        result.averageSatisfiedTime = calculateAverageTime(result.satisfiedPctCount, result.duration);
        // Calculate percentages only if we have data
        if (result.totalRows > 0) {
          Object.keys(result.exchanges).forEach((exchange) => {
            const stats = result.exchanges[exchange];
            stats.maxExPct = Number(((stats.maxExCount / result.totalRows) * 100).toFixed(2));
            stats.minExPct = Number(((stats.minExCount / result.totalRows) * 100).toFixed(2));
          });
        }

        resolve(result);
      },
    );
  });
}

/*
async function checkExample() {
  try {
    const analysis = await analyzeExchangeLog('logs/prices_ETH_USDT_1737045883.log');
    console.log(analysis);
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}
*/

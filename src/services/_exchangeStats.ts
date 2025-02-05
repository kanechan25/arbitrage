import { CEX, IExchangeAnalysis, IListenTicker } from '@/types/cex.types';
import { createLogger, transports, format } from 'winston';
import { ConfigService } from '@nestjs/config';
import { calculateAverageTime, calculateTimeDifference } from '@/utils';

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
      [CEX.BINANCE]: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      [CEX.BITGET]: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      [CEX.BYBIT]: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      [CEX.HUOBI]: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      [CEX.MEXC]: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
      [CEX.OKX]: { maxExCount: 0, maxExPct: 0, minExCount: 0, minExPct: 0 },
    },
    startTimestamp: '',
    endTimestamp: '',
    duration: '',
    satisfiedPctCount: 0,
    satisfiedProfitPctAvg: 0,
    averageSatisfiedTime: '',
    symbol: '',
  };
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
        result.symbol = logEntries[logEntries.length - 1]?.symbol;
        const configProfitPctDiff = configService.get('min_profit_percentage')[result.symbol];

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
              if (data.diffPercentage && data.diffPercentage > configProfitPctDiff) {
                result.satisfiedPctCount++;
                result.satisfiedProfitPctAvg += data.diffPercentage;
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
        result.satisfiedProfitPctAvg =
          result.satisfiedPctCount > 0
            ? Number((result.satisfiedProfitPctAvg / result.satisfiedPctCount).toFixed(4))
            : 0;
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

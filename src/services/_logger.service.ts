import { IListenTicker } from '@/types/cex.types';
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
const { combine, timestamp, json } = winston.format;

@Injectable()
export class LoggerService {
  private logger: winston.Logger;
  private priceLoggers: Map<string, winston.Logger> = new Map();
  private arbitrageLoggers: Map<string, winston.Logger> = new Map();

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: combine(timestamp(), json()),
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
    });
  }
  logInfo(message: string) {
    this.logger.info(message);
  }

  logWarning(message: string) {
    this.logger.warn(message);
  }
  logError(error: Error, context: string) {
    this.logger.error(`Error in ${context}`, {
      message: error.message,
      stack: error.stack,
    });
  }

  logPrices(data: IListenTicker) {
    const timeNow = Math.floor(new Date().getTime() / 1000);
    const symbol = data.symbol.replace('/', '_');

    if (!this.priceLoggers.has(symbol)) {
      const priceLogger = winston.createLogger({
        format: combine(timestamp(), json()),
        transports: [
          new winston.transports.File({
            filename: `logs/_${timeNow}_prices_${symbol}.log`,
          }),
        ],
      });
      this.priceLoggers.set(symbol, priceLogger);
    }

    this.priceLoggers.get(symbol).info('', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  logArbitrage(data: Record<string, string>) {
    try {
      const symbol = Object.keys(data)[0].replace('/', '_');
      const timeNow = Math.floor(new Date().getTime() / 1000);

      if (!this.arbitrageLoggers.has(symbol)) {
        const arbitrageLogger = winston.createLogger({
          format: combine(timestamp(), json()),
          transports: [
            new winston.transports.File({
              filename: `logs/_${timeNow}_arbitrage_${symbol}.log`,
            }),
          ],
        });
        this.arbitrageLoggers.set(symbol, arbitrageLogger);
      }

      const logger = this.arbitrageLoggers.get(symbol);
      for (const value of Object.values(data)) {
        logger.info('', {
          data: value,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      this.logger.error('Failed to log arbitrage data', { error: error.message });
    }
  }

  logTrade(trade: { type: 'BUY' | 'SELL'; dex: string; amount: number; price: number; txHash: string }) {
    this.logger.info('Trade executed', { ...trade });
  }

  logProfit(profit: { amount: number; buyDex: string; sellDex: string; duration: number }) {
    this.logger.info('Profit realized', { ...profit });
  }
}

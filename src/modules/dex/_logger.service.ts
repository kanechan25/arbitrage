import winston from 'winston';

export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
    });
  }

  logTrade(trade: { type: 'BUY' | 'SELL'; dex: string; amount: number; price: number; txHash: string }) {
    this.logger.info('Trade executed', { ...trade });
  }

  logError(error: Error, context: string) {
    this.logger.error(`Error in ${context}`, {
      message: error.message,
      stack: error.stack,
    });
  }

  logProfit(profit: { amount: number; buyDex: string; sellDex: string; duration: number }) {
    this.logger.info('Profit realized', { ...profit });
  }
}

import { IListenTicker, ITicker } from '@/types/cex';
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ccxt from 'ccxt';
import { BinanceService } from '@/services/cex/binance/binance.service';
import { PricesService } from '@/services/cex/prices.service';

@Injectable()
export class CexArbService implements OnModuleInit, OnModuleDestroy {
  private recentTicks: ITicker[] = [];
  private readonly logger = new Logger(CexArbService.name);
  private exchanges: Map<string, ccxt.Exchange> = new Map();
  private isWatching = false;

  constructor(
    private binanceService: BinanceService,
    private configService: ConfigService,
    private pricesService: PricesService,
  ) {
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
    for (const exchange of this.exchanges.values()) {
      await exchange.close();
    }
  }

  async startWatching() {
    this.isWatching = true;
    const symbol: string = this.configService.get('symbol');
    // const [base, quote] = symbol.split('/');

    // const symbols: string[] = this.configService.get('symbols');
    try {
      while (this.isWatching) {
        const fetchTicker: IListenTicker | null = await this.pricesService.fetchSingleTicker(this.exchanges, symbol);
        if (fetchTicker) {
          // const balanceResult = await this.binanceService.convertQuoteToBase(symbol, 6);
          // this.logger.log('balanceResult: ', balanceResult);
          this.stopWatching();
        }
        // after all actions, delay
        // await this.delay();
      }
    } catch (error) {
      this.logger.error('Error in price watching loop:', error);
      this.isWatching = false;
    }
  }

  private async delay(): Promise<void> {
    const delay_min: number = this.configService.get('fetch_delay_min');
    const delay_max: number = this.configService.get('fetch_delay_max');
    const delay = Math.floor(Math.random() * (delay_max - delay_min)) + delay_min;
    this.logger.log(`____________________________________delay: ${delay}`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  stopWatching() {
    this.isWatching = false;
    this.logger.log('Stopping price watching ./.');
  }
  public getRecentTicks(): ITicker[] {
    return this.recentTicks;
  }
}

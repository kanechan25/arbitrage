import * as ccxt from 'ccxt';
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ITicker } from '@/types';
import { BinanceService } from '@/modules/cex/binance/binance.service';
import { PricesService } from '@/modules/arbitrage/prices/prices.service';

@Injectable()
export class ArbService implements OnModuleInit, OnModuleDestroy {
  private recentTicks: ITicker[] = [];
  private isWatching = false;
  private readonly logger = new Logger(ArbService.name);
  private exchanges: Map<string, ccxt.Exchange> = new Map();

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
    // const symbols: string[] = this.configService.get('symbols');
    try {
      while (this.isWatching) {
        // const listenTicker = await this.pricesService.fetchSingleTicker(this.exchanges, symbol);
        // await this.pricesService.delay();
        const balanceResult = await this.binanceService.fetchBalance(symbol);
        if (!balanceResult.success) {
          console.error(`Failed to fetch balance: ${balanceResult.error}`);
          continue;
        }
      }
    } catch (error) {
      this.logger.error('Error in price watching loop:', error);
      this.isWatching = false;
    }
  }

  stopWatching() {
    this.isWatching = false;
  }
}

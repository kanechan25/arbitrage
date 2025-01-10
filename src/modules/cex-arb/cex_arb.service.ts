import * as ccxt from 'ccxt';
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PricesService } from '@/modules/cex/prices/prices.service';
import { BinanceService } from '@/modules/cex/binance/binance.service';
import { OkxService } from '@/modules/cex/okx/okx.service';

@Injectable()
export class CexArbService implements OnModuleInit, OnModuleDestroy {
  private isWatching = false;
  private readonly logger = new Logger(CexArbService.name);
  private exchanges: Map<string, ccxt.Exchange> = new Map();

  constructor(
    private binanceService: BinanceService,
    private okxService: OkxService,
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
          verbose: true,
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
    // const symbol: string = this.configService.get('symbol');
    // const symbols: string[] = this.configService.get('symbols');
    try {
      while (this.isWatching) {
        // const listenTicker = await this.pricesService.fetchSingleTicker(this.exchanges, symbol);
        const balanceResult = await this.binanceService.fetchBalance(['USDT', 'ETH']);
        if (!balanceResult.success) {
          console.error(`Failed to fetch balance: ${balanceResult.error}`);
          continue;
        }
        this.logger.log('__balanceResult__', balanceResult);
        await this.pricesService.delay();
      }
    } catch (error) {
      this.logger.error('Error in price watching loop:', error);
      this.isWatching = false;
    }
  }

  async stopWatching() {
    this.isWatching = false;
  }
}

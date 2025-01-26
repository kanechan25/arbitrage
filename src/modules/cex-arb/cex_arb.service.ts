import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ccxt from 'ccxt';
import { ITicker } from '@/types/cex.types';
import { PricesService } from '@/services/cex/prices.service';
import { BinanceService } from '@/services/cex/binance/binance.service';
import { BitgetService } from '@/services/cex/bitget/bitget.service';
import { BybitService } from '@/services/cex/bybit/bybit.service';
import { OkxService } from '@/services/cex/okx/okx.service';
// import { LOG_PATHS } from '@/constants';

@Injectable()
export class CexArbService implements OnModuleInit, OnModuleDestroy {
  private recentTicks: ITicker[] = [];
  private readonly logger = new Logger(CexArbService.name);
  private exchanges: Map<string, ccxt.Exchange> = new Map();
  private isWatching = false;

  constructor(
    private binanceService: BinanceService,
    private okxService: OkxService,
    private bitgetService: BitgetService,
    private bybitService: BybitService,
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
    // const symbol: string = this.configService.get('symbol');
    // const [base, quote] = symbol.split('/');

    // const symbols: string[] = this.configService.get('symbols');
    try {
      while (this.isWatching) {
        // const results = await this.pricesService.fetch_findOp_log_Tickers(this.exchanges, symbols, false);
        // this.logger.log('__justFindOutTickersOptnt: ', results);

        // const binanceBalance = await this.binanceService.fetchBalance(['USDT', 'ETH'], 'spot');
        // this.logger.log('__binanceBalance: ', binanceBalance);

        // const okxBalance = await this.okxService.fetchBalance(['USDT', 'ETH', 'MERL'], 'spot');
        // this.logger.log('__okxBalance: ', okxBalance);

        // const bitgetBalance = await this.bitgetService.fetchBalance(['USDT', 'ETH'], 'spot');
        // this.logger.log('__bitgetBalance: ', bitgetBalance);

        const bybitBalance = await this.bybitService.fetchBalance(['USDT', 'DOGE'], 'spot');
        this.logger.log('__bybitBalance: ', bybitBalance);

        // const analysis = await this.pricesService.analyzeExchangeLog(LOG_PATHS);
        // this.logger.log('__analysis: ', analysis);

        this.stopWatching();
        // await this.pricesService.delay();
      }
    } catch (error) {
      this.logger.error('Error in price watching loop:', error);
      this.isWatching = false;
    }
  }

  stopWatching() {
    this.isWatching = false;
    this.logger.log('Stopping price watching ./.');
  }
  public getRecentTicks(): ITicker[] {
    return this.recentTicks;
  }
}

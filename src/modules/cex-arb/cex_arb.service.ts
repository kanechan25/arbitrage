import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ccxt from 'ccxt';
import { ITicker } from '@/types/cex.types';
import { PricesService } from '@/services/cex/prices.service';
import { BinanceService } from '@/services/cex/binance/binance.service';
import { BitgetService } from '@/services/cex/bitget/bitget.service';
import { BybitService } from '@/services/cex/bybit/bybit.service';
import { OkxService } from '@/services/cex/okx/okx.service';
import { MexcService } from '@/services/cex/mexc/mexc.service';
import { HuobiService } from '@/services/cex/huobi/huobi.service';
import { CexCommonService } from '@/services/cex/cex.common.service';
import { SimulationService } from '@/services/cex/simulation.service';
import { SIMULATION_TYPE } from '@/constants/simulations';
// import { LOG_PATHS } from '@/constants/logs';

@Injectable()
export class CexArbService implements OnModuleInit, OnModuleDestroy {
  private recentTicks: ITicker[] = [];
  private readonly logger = new Logger(CexArbService.name);
  private exchanges: Map<string, ccxt.Exchange> = new Map();
  private isWatching = false;
  private static fetchCount = 0;
  constructor(
    private binanceService: BinanceService,
    private okxService: OkxService,
    private mexcService: MexcService,
    private bitgetService: BitgetService,
    private bybitService: BybitService,
    private huobiService: HuobiService,
    private cexCommonService: CexCommonService,
    private simulationService: SimulationService,
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
    // const [base, quote] = symbol.split('/');

    try {
      while (this.isWatching) {
        const results = await this.pricesService.fetch_findOp_log_Tickers(
          this.exchanges,
          this.configService.get('symbols'),
          SIMULATION_TYPE,
          true,
        );
        CexArbService.fetchCount++;
        console.log(`___________Fetch count: ${CexArbService.fetchCount}`);
        // if (results) {
        //   // Every item in results is a satisfied result => TODO: ARBITRAGE (!!!slippage)
        //   const simulationResults = await Promise.all(
        //     results.map((result) => {
        //       const simulationResult = this.simulationService.simulationArbitrage(result, SIMULATION_TYPE);
        //       return simulationResult;
        //     }),
        //   );
        //   if (simulationResults.some((result) => result.warnings.length > 0)) {
        //     this.stopWatching();
        //     return;
        //   }
        // }
        // const analysis = await this.pricesService.analyzeExchangeLog(LOG_PATHS, false);
        // this.logger.log('__analysis: ', analysis);
        // const result = await this.mexcService.fetchBalance(['PENGU'], 'spot');
        // this.logger.log('__result: ', result);
        // this.stopWatching();
        await this.pricesService.delay();
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

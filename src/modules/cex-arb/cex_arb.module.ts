import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CexArbService } from './cex_arb.service';
import { CexArbController } from './cex_arb.controller';
import { PricesService } from '@/services/cex/prices.service';
import { BinanceService } from '@/services/cex/binance/binance.service';
import { OkxService } from '@/services/cex/okx/okx.service';
import { BitgetService } from '@/services/cex/bitget/bitget.service';
import { LoggerService } from '@/services/_logger.service';
import { BybitService } from '@/services/cex/bybit/bybit.service';
import { MexcService } from '@/services/cex/mexc/mexc.service';
import { HuobiService } from '@/services/cex/huobi/huobi.service';
import { CexCommonService } from '@/services/cex/cex.common.service';

@Module({
  imports: [ConfigModule],
  controllers: [CexArbController],
  providers: [
    CexArbService,
    CexCommonService,
    PricesService,
    BinanceService,
    OkxService,
    BitgetService,
    BybitService,
    MexcService,
    HuobiService,
    LoggerService,
  ],
  exports: [CexArbService],
})
export class CexArbModule {}

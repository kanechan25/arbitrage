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

@Module({
  imports: [ConfigModule],
  controllers: [CexArbController],
  providers: [CexArbService, PricesService, BinanceService, OkxService, BitgetService, BybitService, LoggerService],
  exports: [CexArbService],
})
export class CexArbModule {}

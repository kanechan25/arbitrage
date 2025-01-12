import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CexArbService } from './cex_arb.service';
import { CexArbController } from './cex_arb.controller';
import { PricesService } from '@/services/cex/prices.service';
import { BinanceService } from '@/services/cex/binance/binance.service';
import { OkxService } from '@/services/cex/okx/okx.service';
import { LoggerService } from '@/services/_logger.service';

@Module({
  imports: [ConfigModule],
  controllers: [CexArbController],
  providers: [CexArbService, PricesService, BinanceService, OkxService, LoggerService],
  exports: [CexArbService],
})
export class CexArbModule {}

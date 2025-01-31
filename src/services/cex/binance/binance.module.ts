import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { PricesService } from '../prices.service';
import { CexCommonService } from '../cex.service';

@Module({
  imports: [ConfigModule],
  controllers: [BinanceController],
  providers: [BinanceService, PricesService, CexCommonService],
  exports: [BinanceService],
})
export class BinanceModule {}

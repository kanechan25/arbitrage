import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { PricesService } from '../prices.service';

@Module({
  imports: [ConfigModule],
  controllers: [BinanceController],
  providers: [BinanceService, PricesService],
  exports: [BinanceService],
})
export class BinanceModule {}

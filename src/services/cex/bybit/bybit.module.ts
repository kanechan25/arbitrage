import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BybitService } from './bybit.service';
import { BybitController } from './bybit.controller';
import { PricesService } from '../prices.service';

@Module({
  imports: [ConfigModule],
  controllers: [BybitController],
  providers: [BybitService, PricesService],
  exports: [BybitService],
})
export class BybitModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BitgetService } from './bitget.service';
import { BitgetController } from './bitget.controller';
import { PricesService } from '../prices.service';

@Module({
  imports: [ConfigModule],
  controllers: [BitgetController],
  providers: [BitgetService, PricesService],
  exports: [BitgetService],
})
export class BitgetModule {}

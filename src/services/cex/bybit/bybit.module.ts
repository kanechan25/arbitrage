import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BybitService } from './bybit.service';
import { BybitController } from './bybit.controller';
import { PricesService } from '../prices.service';
import { CexCommonService } from '../cex.common.service';

@Module({
  imports: [ConfigModule],
  controllers: [BybitController],
  providers: [BybitService, PricesService, CexCommonService],
  exports: [BybitService],
})
export class BybitModule {}

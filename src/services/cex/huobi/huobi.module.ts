import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HuobiService } from './huobi.service';
import { HuobiController } from './huobi.controller';
import { PricesService } from '../prices.service';
import { CexCommonService } from '../cex.common.service';

@Module({
  imports: [ConfigModule],
  controllers: [HuobiController],
  providers: [HuobiService, PricesService, CexCommonService],
  exports: [HuobiService],
})
export class HuobiModule {}

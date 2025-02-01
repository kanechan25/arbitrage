import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BitgetService } from './bitget.service';
import { BitgetController } from './bitget.controller';
import { PricesService } from '../prices.service';
import { CexCommonService } from '../cex.common.service';

@Module({
  imports: [ConfigModule],
  controllers: [BitgetController],
  providers: [BitgetService, PricesService, CexCommonService],
  exports: [BitgetService],
})
export class BitgetModule {}

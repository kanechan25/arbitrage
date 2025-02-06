import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MexcService } from './mexc.service';
import { MexcController } from './mexc.controller';
import { PricesService } from '../prices.service';
import { CexCommonService } from '../cex.common.service';

@Module({
  imports: [ConfigModule],
  controllers: [MexcController],
  providers: [MexcService, PricesService, CexCommonService],
  exports: [MexcService],
})
export class MexcModule {}

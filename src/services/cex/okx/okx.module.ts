import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OkxService } from './okx.service';
import { OkxController } from './okx.controller';
import { PricesService } from '../prices.service';
import { CexCommonService } from '../cex.common.service';

@Module({
  imports: [ConfigModule],
  controllers: [OkxController],
  providers: [OkxService, PricesService, CexCommonService],
  exports: [OkxService],
})
export class OkxModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OkxService } from './okx.service';
import { OkxController } from './okx.controller';
import { PricesService } from '../prices.service';

@Module({
  imports: [ConfigModule],
  controllers: [OkxController],
  providers: [OkxService, PricesService],
  exports: [OkxService],
})
export class OkxModule {}

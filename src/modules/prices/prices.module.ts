import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { PricesLogsController } from './prices.logs.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PricesController, PricesLogsController],
  providers: [PricesService],
  exports: [PricesService],
})
export class PricesModule {}

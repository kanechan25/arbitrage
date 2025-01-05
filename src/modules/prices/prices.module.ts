import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PricesService } from './prices.ws.service';
import { PricesController } from './prices.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PricesController],
  providers: [PricesService],
  exports: [PricesService],
})
export class PricesModule {}

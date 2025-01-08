import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArbService } from './arb.service';
import { ArbController } from './arb.controller';
import { BinanceModule } from '../cex/binance/binance.module';
import { PricesModule } from './prices/prices.module';

@Module({
  imports: [ConfigModule, BinanceModule, PricesModule],
  controllers: [ArbController],
  providers: [ArbService],
  exports: [ArbService],
})
export class ArbModule {}

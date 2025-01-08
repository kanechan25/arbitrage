import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArbService } from './arb.service';
import { ArbController } from './arb.controller';
import { BinanceModule } from '../cex/binance/binance.module';

@Module({
  imports: [ConfigModule, BinanceModule],
  controllers: [ArbController],
  providers: [ArbService],
  exports: [ArbService],
})
export class PricesModule {}

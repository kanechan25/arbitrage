import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArbService } from './arb.service';
import { ArbController } from './arb.controller';
import { PricesModule } from './prices/prices.module';
import { BinanceModule } from '../cex/binance/binance.module';
import { OkxModule } from '../cex/okx/okx.module';

@Module({
  imports: [ConfigModule, PricesModule, OkxModule, BinanceModule],
  controllers: [ArbController],
  providers: [ArbService],
  exports: [ArbService],
})
export class ArbModule {}

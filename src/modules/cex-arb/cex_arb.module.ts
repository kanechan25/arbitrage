import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CexArbService } from './cex_arb.service';
import { CexArbController } from './cex_arb.controller';
import { PricesModule } from '../cex/prices/prices.module';
import { BinanceModule } from '../cex/binance/binance.module';
import { OkxModule } from '../cex/okx/okx.module';

@Module({
  imports: [ConfigModule, PricesModule, OkxModule, BinanceModule],
  controllers: [CexArbController],
  providers: [CexArbService],
  exports: [CexArbService],
})
export class CexArbModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CexArbService } from './cex_arb.service';
import { CexArbController } from './cex_arb.controller';
import { BinanceModule } from '../cex/binance/binance.module';
import { OkxModule } from '../cex/okx/okx.module';
import { PricesService } from '@/services/prices.service';

@Module({
  imports: [ConfigModule, OkxModule, BinanceModule],
  controllers: [CexArbController],
  providers: [CexArbService, PricesService],
  exports: [CexArbService],
})
export class CexArbModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CexArbService } from './cex_arb.service';
import { CexArbController } from './cex_arb.controller';
// import { BinanceModule } from '../cex/binance/binance.module';
// import { OkxModule } from '../cex/okx/okx.module';
import { PricesService } from '@/services/prices.service';
import { BinanceService } from '../cex/binance/binance.service';
import { OkxService } from '../cex/okx/okx.service';

@Module({
  imports: [ConfigModule],
  controllers: [CexArbController],
  providers: [CexArbService, PricesService, BinanceService, OkxService],
  exports: [CexArbService],
})
export class CexArbModule {}

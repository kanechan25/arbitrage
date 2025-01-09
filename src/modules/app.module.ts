import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import cexConfig from '@/config/cex.config';
import { DexArbController } from './dex-arb/dex_arb.controller';
import { DexArbModule } from './dex-arb/dex_arb.module';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cexConfig],
    }),
    DexArbModule,
  ],
  controllers: [DexArbController],
  providers: [],
})
export class AppModule {}

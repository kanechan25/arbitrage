import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import cexConfig from '@/config/cex.config';
import { CexArbController } from './cex-arb/cex_arb.controller';
import { CexArbModule } from './cex-arb/cex_arb.module';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cexConfig],
    }),
    CexArbModule,
  ],
  controllers: [CexArbController],
  providers: [],
})
export class AppModule {}

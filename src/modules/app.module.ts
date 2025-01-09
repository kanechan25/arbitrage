import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArbModule } from '@/modules/arbitrage/arb.module';
import cexConfig from '@/config/cex.config';
import { ArbController } from './arbitrage/arb.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cexConfig],
    }),
    ArbModule,
  ],
  controllers: [ArbController],
  providers: [],
})
export class AppModule {}

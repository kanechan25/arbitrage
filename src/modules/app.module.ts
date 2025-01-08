import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArbModule } from '@/modules/arbitrage/arb.module';
import config from '@/config';
import { ArbController } from './arbitrage/arb.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ArbModule,
  ],
  controllers: [ArbController],
  providers: [],
})
export class AppModule {}

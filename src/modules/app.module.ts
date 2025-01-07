import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PricesModule } from '@/modules/prices/prices.module';
import config from '@/config';
import { PricesLogsController } from './prices/prices.logs.controller';
import { PricesController } from './prices/prices.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PricesModule,
  ],
  controllers: [PricesLogsController, PricesController],
  providers: [],
})
export class AppModule {}

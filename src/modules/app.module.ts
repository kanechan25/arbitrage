import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from '@/modules/hello/hello.module';
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
    HelloModule,
    PricesModule,
  ],
  controllers: [PricesController, PricesLogsController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from '@/modules/hello/hello.module';
import { PricesModule } from '@/modules/prices/prices.module';
import config from '@/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    HelloModule,
    PricesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from '@/modules/hello/hello.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HelloModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

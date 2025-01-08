import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OkxService } from './okx.service';
import { OkxController } from './okx.controller';

@Module({
  imports: [ConfigModule],
  controllers: [OkxController],
  providers: [OkxService],
  exports: [OkxService],
})
export class OkxModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BybitService } from './bybit.service';
import { BybitController } from './bybit.controller';

@Module({
  imports: [ConfigModule],
  controllers: [BybitController],
  providers: [BybitService],
  exports: [BybitService],
})
export class BybitModule {}

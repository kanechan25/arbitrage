import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BitgetService } from './bitget.service';
import { BitgetController } from './bitget.controller';

@Module({
  imports: [ConfigModule],
  controllers: [BitgetController],
  providers: [BitgetService],
  exports: [BitgetService],
})
export class BitgetModule {}

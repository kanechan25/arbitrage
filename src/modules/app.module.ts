import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CexArbModule } from '@/modules/cex-arb/cex_arb.module';
import cexConfig from '@/config/cex.config';
import { CexArbController } from './cex-arb/cex_arb.controller';

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

import { Module } from '@nestjs/common';
import { DexArbController } from './dex_arb.controller';
import { DexArbService } from './dex_arb.service';
import { JupiterService } from '@/services/dex/jupiter.service';
import { RaydiumService } from '@/services/dex/raydium.service';
import { WalletService } from '@/services/dex/wallet.service';
import { LoggerService } from '@/services/_logger.service';

@Module({
  imports: [],
  controllers: [DexArbController],
  providers: [DexArbService, JupiterService, RaydiumService, WalletService, LoggerService],
  exports: [DexArbService],
})
export class DexArbModule {}

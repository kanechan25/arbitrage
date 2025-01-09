import { Module } from '@nestjs/common';
import { DexArbController } from './dex_arb.controller';
import { DexArbService } from './dex_arb.service';
import { JupiterService } from '../dex/jupiter.service';
import { RaydiumService } from '../dex/raydium.service';
import { WalletService } from '../dex/wallet.service';
import { LoggerService } from '../dex/_logger.service';

@Module({
  controllers: [DexArbController],
  providers: [DexArbService, JupiterService, RaydiumService, WalletService, LoggerService],
  exports: [DexArbService],
})
export class DexArbModule {}

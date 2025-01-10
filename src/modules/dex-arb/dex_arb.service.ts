import { JupiterService } from '@/modules/dex/jupiter.service';
import { RaydiumService } from '@/modules/dex/raydium.service';
import { WalletService } from '@/modules/dex/wallet.service';
import { LoggerService } from '@/modules/dex/_logger.service';
import { OnModuleInit, OnModuleDestroy, Injectable } from '@nestjs/common';

@Injectable()
export class DexArbService implements OnModuleInit, OnModuleDestroy {
  private isMonitoring = false;
  constructor(
    private jupiterService: JupiterService,
    private raydiumService: RaydiumService,
    private walletService: WalletService,
    private logger: LoggerService,
  ) {}

  async onModuleInit() {
    await this.startMonitoring();
  }
  async onModuleDestroy() {
    this.isMonitoring = false;
  }
  async startMonitoring() {
    this.isMonitoring = true;
    try {
      while (this.isMonitoring) {
        this.logger.logInfo(`____run flows here____ ${Date.now()}`);
      }
    } catch (error) {
      this.isMonitoring = false;
      this.logger.logError(error, 'monitoring');
    }
  }

  async stopMonitoring() {
    this.isMonitoring = false;
    this.logger.logInfo('Arbitrage monitoring stopped');
  }
}

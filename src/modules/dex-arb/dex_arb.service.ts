import { Injectable } from '@nestjs/common';
import { JupiterService } from '@/modules/dex/jupiter.service';
import { RaydiumService } from '@/modules/dex/raydium.service';
import { WalletService } from '@/modules/dex/wallet.service';
import { LoggerService } from '@/modules/dex/_logger.service';
import { CONFIG } from '@/config/constants';
import { IRaydiumPairs } from '@/types/dex';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';

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
    while (this.isMonitoring) {
      try {
        // for (const pair of CONFIG.TRADING_PAIRS) {
        //   await this.checkAndExecuteArbitrage(pair);
        // }
        // await this.getWalletBalance();
        this.logger.logInfo(`____run flows____`);
      } catch (error) {
        this.logger.logError(error, 'monitoring');
      }
    }
  }

  private async checkAndExecuteArbitrage(pair: IRaydiumPairs) {
    const { inputMint, outputMint } = pair;
    const price = await this.jupiterService.getPrice(inputMint, outputMint, 1);
    console.log(price);
  }

  async stopMonitoring() {
    this.isMonitoring = false;
    this.logger.logInfo('Arbitrage monitoring stopped');
  }

  async getWalletBalance(): Promise<number> {
    return this.walletService.getBalance(CONFIG.USDC_MINT);
  }
}

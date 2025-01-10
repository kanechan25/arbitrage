import { Controller, Post, Delete } from '@nestjs/common';
import { DexArbService } from './dex_arb.service';

@Controller('dex-arb')
export class DexArbController {
  constructor(private readonly dexArbService: DexArbService) {}

  @Post('start')
  async startMonitoring() {
    await this.dexArbService.startMonitoring();
    return {
      status: 'DEX Arbitrage started',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete('stop')
  async stopMonitoring() {
    await this.dexArbService.stopMonitoring();
    return {
      status: 'DEX Arbitrage stopped',
      timestamp: new Date().toISOString(),
    };
  }
}

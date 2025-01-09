import { Controller, Get, Post } from '@nestjs/common';
import { DexArbService } from './dex_arb.service';

@Controller('dex-arb')
export class DexArbController {
  constructor(private readonly dexArbService: DexArbService) {}

  @Get('status')
  getStatus() {
    return {
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('start')
  async startMonitoring() {
    await this.dexArbService.startMonitoring();
    return {
      status: 'started',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('stop')
  async stopMonitoring() {
    // Assuming you'll add a stop method to your service
    await this.dexArbService.stopMonitoring();
    return {
      status: 'stopped',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('balance')
  async getWalletBalance() {
    const balance = await this.dexArbService.getWalletBalance();
    return {
      balance,
      timestamp: new Date().toISOString(),
    };
  }
}

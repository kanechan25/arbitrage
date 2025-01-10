import { Controller, Post, Delete } from '@nestjs/common';
import { CexArbService } from './cex_arb.service';

@Controller('cex-arb')
export class CexArbController {
  constructor(private readonly cexArbService: CexArbService) {}

  @Post('start')
  async startWatching() {
    await this.cexArbService.startWatching();
    return {
      message: 'CEX Arbitrage watching started',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete('stop')
  async stopWatching() {
    await this.cexArbService.stopWatching();
    return {
      message: 'CEX Arbitrage watching stopped',
      timestamp: new Date().toISOString(),
    };
  }
}

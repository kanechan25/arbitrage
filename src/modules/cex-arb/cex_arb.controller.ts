import { Controller, Post, Delete } from '@nestjs/common';
import { CexArbService } from './cex_arb.service';

@Controller('cex-arb')
export class CexArbController {
  constructor(private readonly cexArbService: CexArbService) {}

  @Post('start')
  async startWatching() {
    await this.cexArbService.startWatching();
    return { message: 'Arbitrage watching started' };
  }

  @Delete('stop')
  stopWatching() {
    this.cexArbService.stopWatching();
    return { message: 'Arbitrage watching stopped' };
  }
}

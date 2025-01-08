import { Controller, Post, Delete } from '@nestjs/common';
import { ArbService } from './arb.service';

@Controller('arbitrage')
export class ArbController {
  constructor(private readonly arbService: ArbService) {}

  @Post('start')
  async startWatching() {
    await this.arbService.startWatching();
    return { message: 'Arbitrage watching started' };
  }

  @Delete('stop')
  stopWatching() {
    this.arbService.stopWatching();
    return { message: 'Arbitrage watching stopped' };
  }
}

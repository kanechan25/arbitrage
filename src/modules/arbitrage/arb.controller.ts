import { Controller, Post, Delete } from '@nestjs/common';
import { ArbService } from './arb.service';

@Controller('arbitrage')
export class ArbController {
  constructor(private readonly arbController: ArbService) {}

  @Post('start')
  async startWatching() {
    await this.arbController.startWatching();
    return { message: 'Price watching started' };
  }

  @Delete('stop')
  stopWatching() {
    this.arbController.stopWatching();
    return { message: 'Price watching stopped' };
  }
}

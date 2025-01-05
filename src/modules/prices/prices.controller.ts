import { Controller, Post, Delete } from '@nestjs/common';
import { PricesService } from './prices.ws.service';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post('start')
  async startWatching() {
    await this.pricesService.startWatching();
    return { message: 'Price watching started' };
  }

  @Delete('stop')
  stopWatching() {
    this.pricesService.stopWatching();
    return { message: 'Price watching stopped' };
  }
}

import { Controller, Get } from '@nestjs/common';
import { PricesService } from './prices.service';

@Controller('prices/logs')
export class PricesLogsController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  getRecentTicks() {
    return {
      ticks: this.pricesService.getRecentTicks(),
      timestamp: new Date().toISOString(),
    };
  }
}

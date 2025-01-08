import { Controller, Get } from '@nestjs/common';
import { PricesService } from './prices.service';
import { ITicker } from '@/types';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('recent')
  getRecentTicks(): ITicker[] {
    return this.pricesService.getRecentTicks();
  }
}

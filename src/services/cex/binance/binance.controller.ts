import { Controller, Get } from '@nestjs/common';
import { BinanceService } from './binance.service';

@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('balance')
  async getBalance() {
    return await this.binanceService.fetchBalance();
  }
}

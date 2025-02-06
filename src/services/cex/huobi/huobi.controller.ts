import { Controller, Get } from '@nestjs/common';
import { HuobiService } from './huobi.service';

@Controller('huobi')
export class HuobiController {
  constructor(private readonly huobiService: HuobiService) {}

  @Get('balance')
  async getBalance() {
    return await this.huobiService.fetchBalance();
  }
}

import { Controller, Get } from '@nestjs/common';
import { MexcService } from './mexc.service';

@Controller('mexc')
export class MexcController {
  constructor(private readonly mexcService: MexcService) {}

  @Get('balance')
  async getBalance() {
    return await this.mexcService.fetchBalance();
  }
}

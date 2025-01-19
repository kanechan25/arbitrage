import { Controller, Get } from '@nestjs/common';
import { BitgetService } from './bitget.service';

@Controller('bitget')
export class BitgetController {
  constructor(private readonly bitgetService: BitgetService) {}

  @Get('balance')
  async getBalance() {
    return await this.bitgetService.fetchBalance();
  }
}

import { Controller, Get } from '@nestjs/common';
import { BybitService } from './bybit.service';

@Controller('bybit')
export class BybitController {
  constructor(private readonly bybitService: BybitService) {}

  @Get('balance')
  async getBalance() {
    return await this.bybitService.fetchBalance();
  }
}

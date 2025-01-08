import { Controller, Get } from '@nestjs/common';
import { OkxService } from './okx.service';

@Controller('okx')
export class OkxController {
  constructor(private readonly okxService: OkxService) {}

  @Get('balance')
  async getBalance() {
    return await this.okxService.fetchBalance();
  }
}

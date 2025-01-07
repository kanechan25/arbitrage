import { Controller, Get, Logger } from '@nestjs/common';
import { PricesService } from './prices.service';

@Controller('prices/logs')
export class PricesLogsController {
  private readonly logger = new Logger(PricesLogsController.name);

  constructor(private readonly pricesService: PricesService) {}

  @Get()
  getRecentTicks() {
    try {
      this.logger.log('Fetching recent ticks');
      const ticks = this.pricesService.getRecentTicks();
      return {
        success: true,
        ticks: ticks,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error fetching ticks: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

import { Controller, Get, Logger } from '@nestjs/common';
import { ArbService } from '../arb.service';

@Controller('logs')
export class PricesLogsController {
  private readonly logger = new Logger(PricesLogsController.name);

  constructor(private readonly arbController: ArbService) {}

  @Get()
  getRecentTicks() {
    try {
      this.logger.log('Fetching recent ticks');
      const ticks = this.arbController.getRecentTicks();
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

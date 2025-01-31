import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PricesService } from './prices.service';
import * as ccxt from 'ccxt';
import { WalletType } from '@/types/cex.types';
@Injectable()
export class CexCommonService {
  private readonly log = new Logger(CexCommonService.name);

  constructor(
    private pricesService: PricesService,
    private configService: ConfigService,
  ) {}

  async fetchCexBalance(exchange: ccxt.Exchange, symbol?: string[], type: WalletType = 'spot') {
    try {
      const balance = await exchange.fetchBalance({ type });
      if (symbol) {
        return {
          success: true,
          data: symbol.map((sym) => ({
            symbol: sym,
            type,
            free: balance[sym]?.free || 0,
            used: balance[sym]?.used || 0,
            total: balance[sym]?.total || 0,
          })),
        };
      }
      return {
        success: true,
        data: balance,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

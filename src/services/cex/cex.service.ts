import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PricesService } from './prices.service';
import * as ccxt from 'ccxt';
import { ICurrencyInterface, WalletType } from '@/types/cex.types';
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

  // get withdrawal info of a coin in that cex (withdrawal fees, minDeposit, maxDeposit, etc)
  async getInfoWithdrawalTokens(exchange: ccxt.Exchange, coin: string) {
    try {
      const currencies = await exchange.fetchCurrencies();
      const coinInfo = currencies[coin] as ICurrencyInterface;

      if (!coinInfo) {
        throw new Error(`Coin ${coin} not found`);
      }

      return {
        success: true,
        data: {
          coin,
          active: coinInfo.active,
          withdrawEnabled: coinInfo.withdraw,
          depositEnabled: coinInfo.deposit,
          withdrawalFees: coinInfo.fees,
          networks: coinInfo.networks,
          // coinInfo,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

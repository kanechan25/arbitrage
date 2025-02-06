import { WalletType } from '@/types/cex.types';
import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { CexCommonService } from '@/services/cex/cex.common.service';
import { huobiTransfer2 } from '@/config/wallets';

@Injectable()
export class HuobiService {
  private exchange: ccxt.huobi;

  constructor(private cexCommonService: CexCommonService) {
    this.exchange = new ccxt.huobi({
      apiKey: process.env.HUOBI_API_KEY,
      secret: process.env.HUOBI_API_SECRET,
      enableRateLimit: true,
    });
  }

  async withdraw2Cex() {
    try {
      const results: Record<string, any> = {};

      // First verify all addresses are whitelisted
      for (const wallet of huobiTransfer2) {
        if (wallet.amount > 0) {
          try {
            const addressInfo = await this.exchange.fetchWithdrawals();
            const isWhitelisted = addressInfo.some(
              (addr: any) => addr.address === wallet.address && addr.currency === wallet.coin.toLowerCase(),
            );

            if (!isWhitelisted) {
              throw new Error(
                `Address ${wallet.address} for ${wallet.coin} is not whitelisted. ` +
                  'Please add it to your Huobi address book first and wait 24-48 hours before withdrawing.',
              );
            }
          } catch (error) {
            results[wallet.platform] = {
              success: false,
              error: error.message,
            };
            continue;
          }
        }
      }

      await Promise.all(
        huobiTransfer2.map(async (wallet) => {
          if (wallet.amount > 0) {
            const withdrawResult = await this.cexCommonService.withdrawCrypto(this.exchange, {
              coin: wallet.coin,
              amount: wallet.amount,
              address: wallet.address,
              network: wallet.network,
            });
            results[wallet.platform] = withdrawResult;
          } else {
            results[wallet.platform] = {};
          }
        }),
      );
      return {
        success: true,
        error: null,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: {},
      };
    }
  }

  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    return await this.cexCommonService.fetchCexBalance(this.exchange, symbol, type);
  }
  // get withdrawal info of a coin in that cex (withdrawal fees, minDeposit, maxDeposit, etc)
  async fetchWithdrawalInfo(coin: string) {
    return await this.cexCommonService.getInfoWithdrawalTokens(this.exchange, coin);
  }

  async spotQuoteToBase(symbol: string, quoteAmount: number, watchedBasePrice?: number) {
    // minimum notional: requires min 10 USDT for most pairs
    return await this.cexCommonService.orderQuoteToBase(this.exchange, symbol, quoteAmount, watchedBasePrice);
  }
  async spotBaseToQuote(symbol: string, baseAmount: number, watchedBasePrice?: number) {
    return await this.cexCommonService.orderBaseToQuote(this.exchange, symbol, baseAmount, watchedBasePrice);
  }
}

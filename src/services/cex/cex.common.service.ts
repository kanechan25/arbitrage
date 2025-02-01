import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PricesService } from './prices.service';
import * as ccxt from 'ccxt';
import { ICurrencyInterface, WalletType, WithdrawParams } from '@/types/cex.types';
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

  async withdrawCrypto(exchange: ccxt.Exchange, params: WithdrawParams) {
    try {
      // First verify if withdrawal is possible
      const withdrawInfo = await exchange.fetchCurrencies();
      const coinInfo = withdrawInfo[params.coin];

      if (!coinInfo || !coinInfo.active || !coinInfo.withdraw) {
        throw new Error(`Withdrawals for ${params.coin} are currently disabled`);
      }

      const networks = coinInfo.networks;
      let selectedNetwork = null;

      if (params.network) {
        selectedNetwork = networks[params.network];
        if (!selectedNetwork) {
          throw new Error(`Network ${params.network} not found for ${params.coin}`);
        }
      } else {
        selectedNetwork = Object.values(networks)[0];
      }

      // Check minimum withdrawal
      if (params.amount < selectedNetwork.withdrawMin) {
        throw new Error(
          `Amount ${params.amount} is below minimum withdrawal of ${selectedNetwork.withdrawMin} ${params.coin}`,
        );
      }

      const withdrawal = await exchange.withdraw(params.coin, params.amount, params.address, params.tag, {
        network: params.network,
        memo: params.memo,
      });

      return {
        success: true,
        data: {
          id: withdrawal.id,
          txid: withdrawal.txid,
          amount: withdrawal.amount,
          fee: withdrawal.fee,
          network: params.network,
          status: withdrawal.status,
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

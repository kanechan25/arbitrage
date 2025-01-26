// import { depositWallets } from '@/config/wallets';
// import { WithdrawParams } from '@/types/cex.types';
import { WalletType } from '@/types/cex.types';
import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { PricesService } from '@/services/cex/prices.service';

@Injectable()
export class BitgetService {
  private exchange: ccxt.bitget;

  constructor(private pricesService: PricesService) {
    this.exchange = new ccxt.bitget({
      apiKey: process.env.BITGET_API_KEY,
      secret: process.env.BITGET_API_SECRET,
      password: process.env.BITGET_PASSWORD,
      enableRateLimit: true, // Helps to respect Bitget's rate limits
    });
  }

  async fetchBalance(symbol?: string[], type: WalletType = 'spot') {
    return await this.pricesService.fetchCexBalance(this.exchange, symbol, type);
  }

  // async spotQuoteToBase(symbol: string, quoteAmount: number, watchedBasePrice: number) {
  //   try {
  //     // Get market info to check minimum notional
  //     const markets = await this.exchange.loadMarkets();
  //     const market = markets[symbol];

  //     const ticker = await this.exchange.fetchTicker(symbol);
  //     const currentPrice = ticker.last;

  //     const baseAmount = quoteAmount / currentPrice;
  //     // Check minimum notional (Bitget requires min 5 USDT for most pairs)
  //     const notionalValue = baseAmount * currentPrice;
  //     if (notionalValue < market.limits.cost.min) {
  //       throw new Error(
  //         `Order value (${notionalValue} USDT) is below minimum notional value of ${market.limits.cost.min} USDT`,
  //       );
  //     }
  //     console.log('__ spotQuoteToBase: ', { watchedBasePrice, currentPrice, baseAmount, notionalValue });
  //     // const order = await this.exchange.createMarketBuyOrder(symbol, baseAmount);
  //     // return {
  //     //   success: true,
  //     //   data: order,
  //     // };
  //   } catch (error: any) {
  //     let errorMessage = 'An error occurred while placing the order.';
  //     if (error instanceof ccxt.BaseError) {
  //       errorMessage = `CCXT Error: ${error.message}`;
  //     } else if (error instanceof Error) {
  //       errorMessage = error.message;
  //     }
  //     return {
  //       success: false,
  //       error: errorMessage,
  //     };
  //   }
  // }

  // async withdrawCrypto(params: WithdrawParams) {
  //   try {
  //     // First verify if withdrawal is possible
  //     const withdrawInfo = await this.exchange.fetchCurrencies();
  //     const coinInfo = withdrawInfo[params.coin];

  //     if (!coinInfo || !coinInfo.active || !coinInfo.withdraw) {
  //       throw new Error(`Withdrawals for ${params.coin} are currently disabled`);
  //     }

  //     const networks = coinInfo.networks;
  //     let selectedNetwork = null;

  //     if (params.network) {
  //       selectedNetwork = networks[params.network];
  //       if (!selectedNetwork) {
  //         throw new Error(`Network ${params.network} not found for ${params.coin}`);
  //       }
  //     } else {
  //       selectedNetwork = Object.values(networks)[0];
  //     }

  //     // Check minimum withdrawal
  //     if (params.amount < selectedNetwork.withdrawMin) {
  //       throw new Error(
  //         `Amount ${params.amount} is below minimum withdrawal of ${selectedNetwork.withdrawMin} ${params.coin}`,
  //       );
  //     }

  //     const withdrawal = await this.exchange.withdraw(params.coin, params.amount, params.address, params.tag, {
  //       network: params.network,
  //       memo: params.memo,
  //     });

  //     return {
  //       success: true,
  //       data: {
  //         id: withdrawal.id,
  //         txid: withdrawal.txid,
  //         amount: withdrawal.amount,
  //         fee: withdrawal.fee,
  //         network: params.network,
  //         status: withdrawal.status,
  //       },
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: error.message,
  //     };
  //   }
  // }
  // async getWithdrawalInfo(coin: string) {
  //   try {
  //     const currencies = await this.exchange.fetchCurrencies();
  //     const coinInfo = currencies[coin];

  //     if (!coinInfo) {
  //       throw new Error(`Coin ${coin} not found`);
  //     }

  //     return {
  //       success: true,
  //       data: {
  //         coin,
  //         networks: coinInfo.networks,
  //         active: coinInfo.active,
  //         withdrawEnabled: coinInfo.withdraw,
  //         depositEnabled: coinInfo.deposit,
  //       },
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: error.message,
  //     };
  //   }
  // }
  // async deposit2Wallets() {
  //   try {
  //     const results: Record<string, any> = {};
  //     await Promise.all(
  //       depositWallets.map(async (wallet) => {
  //         if (wallet.amount > 0) {
  //           const withdrawResult = await this.withdrawCrypto({
  //             coin: wallet.coin,
  //             amount: wallet.amount,
  //             address: wallet.address,
  //             network: wallet.network,
  //           });
  //           results[wallet.platform] = withdrawResult;
  //         } else {
  //           results[wallet.platform] = {};
  //         }
  //       }),
  //     );
  //     return {
  //       success: true,
  //       error: null,
  //       data: results,
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: error.message,
  //       data: {},
  //     };
  //   }
  // }
}

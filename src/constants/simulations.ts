import { CEX, IWalletBalance } from '@/types/cex.types';

export const mockCexBalances: Record<string, IWalletBalance> = {
  [CEX.BINANCE]: {
    USDT: 1000,
    PENGU: 20000, // 0.012405
    ARB: 2000, // 0.4708
    HBAR: 10000, // 0.27176
  },
  [CEX.OKX]: {
    USDT: 1000,
    PENGU: 20000,
    ARB: 2000,
    HBAR: 10000,
  },
  [CEX.HUOBI]: {
    USDT: 1000,
    PENGU: 100000,
    ARB: 2000,
    HBAR: 10000,
  },
  [CEX.MEXC]: {
    USDT: 1000,
    PENGU: 100000,
    ARB: 2000,
    HBAR: 10000,
  },
  [CEX.BITGET]: {
    USDT: 2000,
    PENGU: 100000,
    ARB: 2000,
    HBAR: 10000,
  },
  [CEX.BYBIT]: {
    USDT: 1000,
    PENGU: 20000,
    ARB: 2000,
    HBAR: 10000,
  },
};

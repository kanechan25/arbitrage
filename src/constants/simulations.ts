import { CEX, IWalletBalance, SimulationType } from '@/types/cex.types';

export const mockCexBalances: Record<string, IWalletBalance> = {
  [CEX.BINANCE]: {
    USDT: 100000,
    PENGU: 2000000, // 0.012405
    ARB: 2000, // 0.4708
    HBAR: 10000, // 0.27176
  },
  [CEX.OKX]: {
    USDT: 100000,
    PENGU: 2000000,
    ARB: 2000,
    HBAR: 10000,
  },
  [CEX.HUOBI]: {
    USDT: 100000,
    PENGU: 10000000,
    ARB: 2000,
    HBAR: 10000,
  },
  [CEX.MEXC]: {
    USDT: 100000,
    PENGU: 10000000,
    ARB: 2000,
    HBAR: 10000,
  },
  [CEX.BITGET]: {
    USDT: 200000,
    PENGU: 10000000,
    ARB: 2000,
    HBAR: 10000,
  },
  [CEX.BYBIT]: {
    USDT: 100000,
    PENGU: 2000000,
    ARB: 2000,
    HBAR: 10000,
  },
};

export const SIMULATION_TYPE: SimulationType = 'use-native';

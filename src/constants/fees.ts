import { USDT } from '@/config/tokens';
import { CEX, ISpotFees } from '@/types/cex.types';

export const spotFees: Record<string, ISpotFees> = {
  [CEX.BINANCE]: {
    default: 0.1,
    discounted: 0.075,
  },
  [CEX.OKX]: {
    default: 0.1,
    discounted: 0.07,
  },
  [CEX.MEXC]: {
    default: 0.05,
    discounted: 0.025,
    customValues: {
      [USDT.APT]: 0,
      [USDT.ARB]: 0,
      [USDT.PNUT]: 0,
      [USDT.TIA]: 0,
      [USDT.TRUMP]: 0,
      [USDT.WIF]: 0,
      [USDT.WLD]: 0,
    },
  },
  [CEX.BITGET]: {
    default: 0.1,
    discounted: 0.08,
  },
  [CEX.BYBIT]: {
    default: 0.1,
    discounted: 0.08,
  },
  [CEX.HUOBI]: {
    default: 0.2,
    discounted: 0.1275,
  },
};

import { CEX } from '@/types/cex.types';
import { USDT } from '@/config/tokens';

interface TradingPairConfig {
  defaultValue: number;
  customValues?: Record<string, number>;
}

function generateTradingPairs(config: TradingPairConfig): Record<string, number> {
  const result: Record<string, number> = {};
  Object.values(USDT).forEach((pair) => {
    result[pair] = config.customValues?.[pair] ?? config.defaultValue;
  });

  return result;
}

export default () => ({
  symbol: USDT.SOL,
  symbols: [USDT.PENGU, USDT.ARB, USDT.HBAR],
  min_profit_percentage: generateTradingPairs({
    defaultValue: 0.2,
    customValues: {
      // [USDT.ADA]: 0.2, // add custom values for specific pairs
    },
  }),
  exchanges: [
    {
      name: CEX.BINANCE,
      apiKey: process.env.BINANCE_API_KEY,
      apiSecret: process.env.BINANCE_API_SECRET,
    },
    {
      name: CEX.OKX,
      apiKey: process.env.OKX_API_KEY,
      apiSecret: process.env.OKX_API_SECRET,
    },
    {
      name: CEX.MEXC,
      apiKey: process.env.MEXC_API_KEY,
      apiSecret: process.env.MEXC_API_SECRET,
    },
    {
      name: CEX.BITGET,
      apiKey: process.env.BITGET_API_KEY,
      apiSecret: process.env.BITGET_API_SECRET,
    },
    {
      name: CEX.BYBIT,
      apiKey: process.env.BYBIT_API_KEY,
      apiSecret: process.env.BYBIT_API_SECRET,
    },
    {
      name: CEX.HUOBI,
      apiKey: process.env.HUOBI_API_KEY,
      apiSecret: process.env.HUOBI_API_SECRET,
    },
  ],
  usdt_amount: 100,
  min_usdt_price_diff: {
    'SOL/USDT': 0.05,
  },
  fetch_delay_min: 5000,
  fetch_delay_max: 8500,
});

import { CEX } from '@/types/cex.types';
import { USDT } from '@/config/tokens';

export default () => ({
  symbol: USDT.SOL,
  symbols: [USDT.PENGU, USDT.MOVE, USDT.TRUMP, USDT.WLD, USDT.APT, USDT.LTC],
  min_profit_percentage: {
    [USDT.ADA]: 0.21,
    [USDT.SOL]: 0.21,
    [USDT.TRUMP]: 0.21,
    [USDT.DOGE]: 0.21,
    [USDT.SUI]: 0.21,
    [USDT.XRP]: 0.21,
    [USDT.WLD]: 0.21,
    [USDT.LINK]: 0.21,
    [USDT.DOT]: 0.21,
    [USDT.TRX]: 0.21,
    [USDT.TON]: 0.21,
    [USDT.PENGU]: 0.21,
    [USDT.MOVE]: 0.21,
    [USDT.APT]: 0.21,
    [USDT.LTC]: 0.21,
  },
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
  fetch_delay_min: 1000,
  fetch_delay_max: 1400,
});

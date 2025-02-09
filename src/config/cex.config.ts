import { CEX } from '@/types/cex.types';
import { USDT } from '@/config/tokens';

export default () => ({
  symbols: [USDT.PENGU, USDT.ARB, USDT.HBAR],
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
  arbitrage_usdt_amount: 5,
  fetch_delay_min: 1000,
  fetch_delay_max: 2000,
});

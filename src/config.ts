export default () => ({
  symbol: 'ETH/USDT',
  exchanges: [
    {
      name: 'binance',
      apiKey: process.env.BINANCE_API_KEY,
      apiSecret: process.env.BINANCE_API_SECRET,
    },
    {
      name: 'mexc',
      apiKey: process.env.MEXC_API_KEY,
      apiSecret: process.env.MEXC_API_SECRET,
    },
    {
      name: 'bitget',
      apiKey: process.env.BITGET_API_KEY,
      apiSecret: process.env.BITGET_API_SECRET,
    },
    {
      name: 'bybit',
      apiKey: process.env.BYBIT_API_KEY,
      apiSecret: process.env.BYBIT_API_SECRET,
    },
    {
      name: 'huobi',
      apiKey: process.env.HUOBI_API_KEY,
      apiSecret: process.env.HUOBI_API_SECRET,
    },
    {
      name: 'lbank',
      apiKey: process.env.LBANK_API_KEY,
      apiSecret: process.env.LBANK_API_SECRET,
    },
  ],
  usdt_amount: 100,
  usdt_price_diff: 5,
  min_profit_percentage: 1,
  pause_interval: 20,
});

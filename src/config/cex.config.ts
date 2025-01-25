export default () => ({
  symbol: 'ETH/USDT',
  symbols: ['TRUMP/USDT', 'SOL/USDT'],
  min_profit_percentage: {
    'TRUMP/USDT': 0.12,
    'SOL/USDT': 0.02,
  },
  exchanges: [
    {
      name: 'binance',
      apiKey: process.env.BINANCE_API_KEY,
      apiSecret: process.env.BINANCE_API_SECRET,
    },
    {
      name: 'okx',
      apiKey: process.env.OKX_API_KEY,
      apiSecret: process.env.OKX_API_SECRET,
    },
    {
      name: 'mexc',
      apiKey: process.env.MEXC_API_KEY,
      apiSecret: process.env.MEXC_API_SECRET,
    },
    {
      name: 'kucoin',
      apiKey: process.env.KUCOIN_API_KEY,
      apiSecret: process.env.KUCOIN_API_SECRET,
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
    // {
    //   name: 'gateio',
    //   apiKey: process.env.GATEIO_API_KEY,
    //   apiSecret: process.env.GATEIO_API_SECRET,
    // },
    // {
    //   name: 'lbank',
    //   apiKey: process.env.LBANK_API_KEY,
    //   apiSecret: process.env.LBANK_API_SECRET,
    // },
  ],
  usdt_amount: 100,
  min_usdt_price_diff: {
    'SOL/USDT': 0.05,
  },
  fetch_delay_min: 3000,
  fetch_delay_max: 5400,
});

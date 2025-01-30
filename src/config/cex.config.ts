export default () => ({
  symbol: 'ETH/USDT',
  symbols: ['WLD/USDT', 'LINK/USDT', 'DOT/USDT', 'TRX/USDT'],
  min_profit_percentage: {
    'ADA/USDT': 0.21,
    'SOL/USDT': 0.21,
    'TRUMP/USDT': 0.21,
    'DOGE/USDT': 0.21,
    'SUI/USDT': 0.21,
    'XRP/USDT': 0.21,
    'WLD/USDT': 0.21,
    'LINK/USDT': 0.21,
    'DOT/USDT': 0.21,
    'TRX/USDT': 0.21,
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
    // {
    //   name: 'kucoin',
    //   apiKey: process.env.KUCOIN_API_KEY,
    //   apiSecret: process.env.KUCOIN_API_SECRET,
    // },
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
  fetch_delay_min: 1000,
  fetch_delay_max: 1400,
});

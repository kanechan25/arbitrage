export const CONFIG = {
  RPC_ENDPOINT: 'YOUR_RPC_ENDPOINT',
  WALLET_PRIVATE_KEY: 'YOUR_WALLET_PRIVATE_KEY',
  MIN_PROFIT_THRESHOLD: 0.5, //in %
  MAX_POSITION_SIZE: 1000, //in USDT
  TRADING_PAIRS: [
    {
      name: 'SOL/USDT',
      tokenMint: 'SOL_MINT_ADDRESS',
      usdtMint: 'USDT_MINT_ADDRESS',
    },
  ],

  // DEX configs
  SLIPPAGE_TOLERANCE: 0.5, // 0.5%
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second

  // Monitoring
  PRICE_CHECK_INTERVAL: 1000, // 1 second
};

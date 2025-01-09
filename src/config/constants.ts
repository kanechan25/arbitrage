export const CONFIG = {
  USDC_MINT: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  SOL_MINT: 'So11111111111111111111111111111111111111112',
  // DEX Program IDs
  RAYDIUM_POOLS: {
    SOL_USDC: 'YOUR_RAYDIUM_SOL_USDC_POOL_ADDRESS',
  },
  // Monitoring settings
  AUTO_START_MONITORING: true,
  MONITORING_INTERVAL: 3000, // 3 seconds
  ERROR_RETRY_INTERVAL: 5000, // 5 seconds

  // Trading parameters
  TRADE_SIZE: 1000, // USDT
  MIN_PROFIT_PERCENTAGE: 0.5, // 0.5%
  MIN_PROFIT_AMOUNT: 10, // USDT
  MAX_PROFIT_AMOUNT: 1000, // USDT

  // Risk management
  MAX_DAILY_TRADES: 100,
  MAX_DAILY_LOSS: 1000, // USDT
  SLIPPAGE_TOLERANCE: 0.5, // 0.5%

  // Trading pairs
  TRADING_PAIRS: [
    {
      inputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      outputMint: 'So11111111111111111111111111111111111111112', // SOL
      name: 'SOL/USDC',
    },
    // Add more pairs as needed
  ],

  // Transaction settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

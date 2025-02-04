import { CEX, CHAIN_BN, CHAIN_OKX, CHAIN_BG, CHAIN_BB, CHAIN_MX, CHAIN_HTX } from '@/types/cex.types';

export const WALLETS = Object.freeze({
  [CEX.BINANCE]: {
    USDT: {
      [CHAIN_BN.BSC]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAIN_BN.ARBITRUM]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAIN_BN.AVAXC]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAIN_BN.APTOS]: '0xbea766cd939c6f66d81dc887ee76df63c0286b5989600c10ff44c3bbe8e9c255',
      [CHAIN_BN.TRON]: 'TNccKLY3ajBfS55ypo1ys3XKzFuruMqwFe',
      [CHAIN_BN.TON]: 'EQD5mxRgCuRNLxKxeOjG6r14iSroLF5FtomPnet-sgP5xNJb',
      [CHAIN_BN.OPTIMISM]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
    },
    ETH: {
      [CHAIN_BN.BSC]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAIN_BN.ARBITRUM]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAIN_BN.OPTIMISM]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
    },
  },
  [CEX.OKX]: {
    USDT: {
      [CHAIN_OKX.ARBITRUM]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
      [CHAIN_OKX.AVAXC]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
      [CHAIN_OKX.OPTIMISM]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
      [CHAIN_OKX.APTOS]: '0x623beddaf733a80b9767007815de0b842ff1b0badaefa57d72f2b191c59a5277',
      [CHAIN_OKX.TON]: 'UQCBoLqxWcRJGoYVc4e2GbRSAxOEtEXokKEPWrbFrephbd7q',
      [CHAIN_OKX.TRON]: 'TNccKLY3ajBfS55ypo1ys3XKzFuruMqwFe',
    },
    ETH: {
      [CHAIN_OKX.ARBITRUM]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
      [CHAIN_OKX.OPTIMISM]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
    },
  },
  [CEX.MEXC]: {
    USDT: {
      [CHAIN_MX.BSC]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
      [CHAIN_MX.ARBITRUM]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
      [CHAIN_MX.AVAXC]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
      [CHAIN_MX.TON]: 'EQBX63RAdgShn34EAFMV73Cut7Z15lUZd1hnVva68SEl7sxi',
      [CHAIN_MX.TRON]: 'TJjSNsdar5W9jpmTpLziiMscJbAHn4bSD7',
      [CHAIN_MX.APTOS]: '0x0abf891001a8ea324644b200ef4e83af0cbdc3dc247dffaa80312517d6fccb6a',
    },
    ETH: {
      [CHAIN_MX.BSC]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
    },
  },
  [CEX.BITGET]: {
    USDT: {
      [CHAIN_BG.BSC]: '0xdc1ae85d9166f516eaa490c5910ac4b85f2e7e05',
      [CHAIN_BG.ARBITRUM]: '0xdc1ae85d9166f516eaa490c5910ac4b85f2e7e05',
      [CHAIN_BG.AVAXC]: '0xdc1ae85d9166f516eaa490c5910ac4b85f2e7e05',
      [CHAIN_BG.TON]: 'UQDkCji1YyiVBePGRkvPnadCY2EkIdm2LI4q2UXFhg7TswV3',
      [CHAIN_BG.TRON]: 'TYwJaP4yxQjEfhUenN3NS3iDFgWcLHRkgk',
      [CHAIN_BG.APTOS]: '0x1176fd6cc4d842f5ebdb528cea0f12a2a7f4169a494359212717ff1916166479',
    },
    ETH: {
      [CHAIN_BG.BSC]: '0xdc1ae85d9166f516eaa490c5910ac4b85f2e7e05',
    },
  },
  [CEX.BYBIT]: {
    USDT: {
      [CHAIN_BB.BSC]: '0x3ba13ad540796e2934c40e0c671687b139a041f5',
      [CHAIN_BB.ARBITRUM]: '0x3ba13ad540796e2934c40e0c671687b139a041f5',
      [CHAIN_BB.AVAXC]: '0x3ba13ad540796e2934c40e0c671687b139a041f5',
      [CHAIN_BB.TON]: 'UQDsGaCJ7cCCNw-rlIBtsI1W7sUimlyPwlbnJ7rHa8Gn42aI',
      [CHAIN_BB.TRON]: 'TUgeiFZaM8PK2wrRLoyPHiy8wTzAX2EDvt',
      [CHAIN_BB.APTOS]: '0x93dd432879fcc8866690d7acd7964bc5c2d31a08393782f9b7eca712a80e41a9',
    },
    ETH: {
      [CHAIN_BB.BSC]: '0x3ba13ad540796e2934c40e0c671687b139a041f5',
    },
  },
  [CEX.HUOBI]: {
    USDT: {
      [CHAIN_HTX.BSC]: '0x18a61fab2d603bdb832b62dfbb3ce0b295df2227',
      [CHAIN_HTX.ARBITRUM]: '0x18a61fab2d603bdb832b62dfbb3ce0b295df2227',
      [CHAIN_HTX.AVAXC]: '0x18a61fab2d603bdb832b62dfbb3ce0b295df2227',
      [CHAIN_HTX.TRON]: 'TUFv6WUbWxtVse9QD1M8RvwoDKbRnc2txh',
      [CHAIN_HTX.SOL]: '23i2vwvuaRYiZoc3BSdGt4LpGHfeyQibyfrtwijhwo8H',
    },
    ETH: {
      [CHAIN_HTX.TRON]: 'TUFv6WUbWxtVse9QD1M8RvwoDKbRnc2txh',
    },
  },
});

// ✔ Withdraw min 10 USDT Binance: BSC -> CELO -> OPTIMISM, AVAXC, APT -> MATIC -> ARB
export const binanceTransfer2 = [
  {
    platform: CEX.OKX,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.OKX].USDT[CHAIN_OKX.APTOS],
    network: CHAIN_BN.APTOS,
  },
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAIN_MX.BSC],
    network: CHAIN_BN.BSC,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAIN_BG.BSC],
    network: CHAIN_BN.BSC,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BYBIT].USDT[CHAIN_BB.BSC],
    network: CHAIN_BN.BSC,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.HUOBI].USDT[CHAIN_HTX.BSC],
    network: CHAIN_BN.BSC,
  },
];

// ✔ Withdraw min 0.1 USDT OKX: APT -> ARB -> OPTIMISM, TON -> AVAXC
export const okxTransfer2 = [
  {
    platform: CEX.BINANCE,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BINANCE].USDT[CHAIN_BN.APTOS],
    network: CHAIN_OKX.APTOS,
  },
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAIN_MX.APTOS],
    network: CHAIN_OKX.APTOS,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAIN_BG.APTOS],
    network: CHAIN_OKX.APTOS,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BYBIT].USDT[CHAIN_BB.APTOS],
    network: CHAIN_OKX.APTOS,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.HUOBI].USDT[CHAIN_HTX.AVAXC],
    network: CHAIN_OKX.AVAXC,
  },
];

// Withdraw min 10 USDT MEXC: BSC -> TON -> APTOS -> OPTIMISM -> ARB
export const mexcTransfer2 = [
  {
    platform: CEX.BINANCE,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BINANCE].USDT[CHAIN_BN.BSC],
    network: CHAIN_MX.BSC,
  },
  {
    platform: CEX.OKX,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.OKX].USDT[CHAIN_OKX.TON],
    network: CHAIN_MX.TON,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAIN_BG.BSC],
    network: CHAIN_MX.BSC,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BYBIT].USDT[CHAIN_BB.BSC],
    network: CHAIN_MX.BSC,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.HUOBI].USDT[CHAIN_HTX.BSC],
    network: CHAIN_MX.BSC,
  },
];

// Withdraw USDT Bitget: BSC -> APT -> AVAXC -> TON, OPTIMISM -> ARB
export const bitgetTransfer2 = [
  {
    platform: CEX.BINANCE,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BINANCE].USDT[CHAIN_BN.BSC],
    network: CHAIN_BG.BSC,
  },
  {
    platform: CEX.OKX,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.OKX].USDT[CHAIN_OKX.APTOS],
    network: CHAIN_BG.APTOS,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BYBIT].USDT[CHAIN_BB.BSC],
    network: CHAIN_BG.BSC,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0.01,
    address: WALLETS[CEX.HUOBI].USDT[CHAIN_HTX.BSC],
    network: CHAIN_BG.BSC,
  },
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAIN_MX.BSC],
    network: CHAIN_BG.BSC,
  },
];

// Withdraw USDT Huobi: AVAXC (locked!! have to upgrade) -> TRON (1.2$) -> SOL
export const huobiTransfer2 = [
  {
    platform: CEX.BINANCE,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BINANCE].USDT[CHAIN_BN.TRON],
    network: CHAIN_HTX.TRON,
  },
  {
    platform: CEX.OKX,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.OKX].USDT[CHAIN_OKX.TRON],
    network: CHAIN_HTX.TRON,
  },
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAIN_MX.TRON],
    network: CHAIN_HTX.TRON,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAIN_BG.TRON],
    network: CHAIN_HTX.TRON,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BYBIT].USDT[CHAIN_BB.TRON],
    network: CHAIN_HTX.TRON,
  },
];

// ✔ Withdraw min 1 USDT Bybit: APT, MANTLE -> TON -> BSC, ARB, OPTIMISM, AVAXC -> TRON
export const bybitTransfer2 = [
  {
    platform: CEX.BINANCE,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BINANCE].USDT[CHAIN_BN.APTOS],
    network: CHAIN_BB.APTOS,
  },
  {
    platform: CEX.OKX,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.OKX].USDT[CHAIN_OKX.APTOS],
    network: CHAIN_BB.APTOS,
  },
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAIN_MX.APTOS],
    network: CHAIN_BB.APTOS,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAIN_BG.APTOS],
    network: CHAIN_BB.APTOS,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.HUOBI].USDT[CHAIN_HTX.BSC],
    network: CHAIN_BB.BSC,
  },
];

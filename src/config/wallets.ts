import { CEX, CHAINS } from '@/types/cex.types';

export const WALLETS = Object.freeze({
  [CEX.BINANCE]: {
    USDT: {
      [CHAINS.BSC]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAINS.ARB]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAINS.AVAX]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAINS.APTOS]: '0xbea766cd939c6f66d81dc887ee76df63c0286b5989600c10ff44c3bbe8e9c255',
      [CHAINS.TRON]: 'TNccKLY3ajBfS55ypo1ys3XKzFuruMqwFe',
      [CHAINS.TON]: 'EQD5mxRgCuRNLxKxeOjG6r14iSroLF5FtomPnet-sgP5xNJb',
      [CHAINS.OPTIMISM]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
    },
    ETH: {
      [CHAINS.BSC]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAINS.ARB]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAINS.OPTIMISM]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
    },
  },
  [CEX.OKX]: {
    USDT: {
      [CHAINS.ARB]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
      [CHAINS.AVAX]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
      [CHAINS.OPTIMISM]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
      [CHAINS.APTOS]: '0x623beddaf733a80b9767007815de0b842ff1b0badaefa57d72f2b191c59a5277',
      [CHAINS.TON]: 'UQCBoLqxWcRJGoYVc4e2GbRSAxOEtEXokKEPWrbFrephbd7q',
      [CHAINS.TRON]: 'TNccKLY3ajBfS55ypo1ys3XKzFuruMqwFe',
    },
    ETH: {
      [CHAINS.ARB]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
      [CHAINS.OPTIMISM]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
    },
  },
  [CEX.MEXC]: {
    USDT: {
      [CHAINS.BSC]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
      [CHAINS.ARB]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
      [CHAINS.AVAX]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
      [CHAINS.TON]: 'EQBX63RAdgShn34EAFMV73Cut7Z15lUZd1hnVva68SEl7sxi',
      [CHAINS.TRON]: 'TJjSNsdar5W9jpmTpLziiMscJbAHn4bSD7',
      [CHAINS.APTOS]: '0x0abf891001a8ea324644b200ef4e83af0cbdc3dc247dffaa80312517d6fccb6a',
    },
    ETH: {
      [CHAINS.BSC]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
    },
  },
  [CEX.BITGET]: {
    USDT: {
      [CHAINS.BSC]: '0xdc1ae85d9166f516eaa490c5910ac4b85f2e7e05',
      [CHAINS.ARB]: '0xdc1ae85d9166f516eaa490c5910ac4b85f2e7e05',
      [CHAINS.AVAX]: '0xdc1ae85d9166f516eaa490c5910ac4b85f2e7e05',
      [CHAINS.TON]: 'UQDkCji1YyiVBePGRkvPnadCY2EkIdm2LI4q2UXFhg7TswV3',
      [CHAINS.TRON]: 'TYwJaP4yxQjEfhUenN3NS3iDFgWcLHRkgk',
      [CHAINS.APTOS]: '0x1176fd6cc4d842f5ebdb528cea0f12a2a7f4169a494359212717ff1916166479',
    },
    ETH: {
      [CHAINS.BSC]: '0xdc1ae85d9166f516eaa490c5910ac4b85f2e7e05',
    },
  },
  [CEX.BYBIT]: {
    USDT: {
      [CHAINS.BSC]: '0x3ba13ad540796e2934c40e0c671687b139a041f5',
      [CHAINS.ARB]: '0x3ba13ad540796e2934c40e0c671687b139a041f5',
      [CHAINS.AVAX]: '0x3ba13ad540796e2934c40e0c671687b139a041f5',
      [CHAINS.TON]: 'UQDsGaCJ7cCCNw-rlIBtsI1W7sUimlyPwlbnJ7rHa8Gn42aI',
      [CHAINS.TRON]: 'TUgeiFZaM8PK2wrRLoyPHiy8wTzAX2EDvt',
      [CHAINS.APTOS]: '0x93dd432879fcc8866690d7acd7964bc5c2d31a08393782f9b7eca712a80e41a9',
    },
    ETH: {
      [CHAINS.BSC]: '0x3ba13ad540796e2934c40e0c671687b139a041f5',
    },
  },
  [CEX.HUOBI]: {
    USDT: {
      [CHAINS.BSC]: '0x18a61fab2d603bdb832b62dfbb3ce0b295df2227',
      [CHAINS.ARB]: '0x18a61fab2d603bdb832b62dfbb3ce0b295df2227',
      [CHAINS.AVAX]: '0x18a61fab2d603bdb832b62dfbb3ce0b295df2227',
      [CHAINS.TRON]: 'TUFv6WUbWxtVse9QD1M8RvwoDKbRnc2txh',
      [CHAINS.SOL]: '23i2vwvuaRYiZoc3BSdGt4LpGHfeyQibyfrtwijhwo8H',
    },
    ETH: {
      [CHAINS.TRON]: 'TUFv6WUbWxtVse9QD1M8RvwoDKbRnc2txh',
    },
  },
});

// Withdraw min 10 USDT Binance: BSC -> OPTIMISM -> APTOS -> MATIC -> ARB
export const binanceTransfer2 = [
  {
    platform: CEX.OKX,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.OKX].USDT[CHAINS.OPTIMISM],
    network: CHAINS.OPTIMISM,
  },
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BYBIT].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.HUOBI].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
];

// Withdraw USDT OKX: APTOS -> ARB -> OPTIMISM, TON
export const okxTransfer2 = [
  {
    platform: CEX.BINANCE,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BINANCE].USDT[CHAINS.APTOS],
    network: CHAINS.APTOS,
  },
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAINS.APTOS],
    network: CHAINS.APTOS,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAINS.APTOS],
    network: CHAINS.APTOS,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BYBIT].USDT[CHAINS.APTOS],
    network: CHAINS.APTOS,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.HUOBI].USDT[CHAINS.ARB],
    network: CHAINS.ARB,
  },
];

// Withdraw USDT MEXC: BSC -> TON -> APTOS -> OPTIMISM -> ARB
export const mexcTransfer2 = [
  {
    platform: CEX.BINANCE,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BINANCE].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.OKX,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.OKX].USDT[CHAINS.TON],
    network: CHAINS.TON,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BYBIT].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.HUOBI].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
];

// Withdraw USDT Bitget: BSC -> APTOS -> AVAX -> TON, OPTIMISM -> ARB
export const bitgetTransfer2 = [
  {
    platform: CEX.BINANCE,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BINANCE].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.OKX,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.OKX].USDT[CHAINS.APTOS],
    network: CHAINS.APTOS,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BYBIT].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.HUOBI].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
];

// Withdraw USDT Huobi: AVAX (locked!! have to upgrade) -> TRON (1.2$) -> SOL
export const huobiTransfer2 = [
  {
    platform: CEX.BINANCE,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BINANCE].USDT[CHAINS.TRON],
    network: CHAINS.TRON,
  },
  {
    platform: CEX.OKX,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.OKX].USDT[CHAINS.TRON],
    network: CHAINS.TRON,
  },
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAINS.TRON],
    network: CHAINS.TRON,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAINS.TRON],
    network: CHAINS.TRON,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BYBIT].USDT[CHAINS.TRON],
    network: CHAINS.TRON,
  },
];

// Withdraw min 1 USDT Bybit: APTOS, MANTLE -> TON -> BSC, ARB, OPTIMISM, AVAX -> TRON
export const bybitTransfer2 = [
  {
    platform: CEX.BINANCE,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BINANCE].USDT[CHAINS.APTOS],
    network: CHAINS.APTOS,
  },
  {
    platform: CEX.OKX,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.OKX].USDT[CHAINS.APTOS],
    network: CHAINS.APTOS,
  },
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAINS.APTOS],
    network: CHAINS.APTOS,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAINS.APTOS],
    network: CHAINS.APTOS,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.HUOBI].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
];

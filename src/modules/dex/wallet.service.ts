import { Injectable } from '@nestjs/common';
import { Connection, Keypair } from '@solana/web3.js';
import { LoggerService } from './_logger.service';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';

@Injectable()
export class WalletService {
  private connection: Connection;
  private wallet: Keypair;
  private logger: LoggerService;
  constructor() {
    this.logger = new LoggerService();
    if (!process.env.RPC_ENDPOINT || !process.env.WALLET_PRIVATE_KEY) {
      throw new Error('Missing required environment variables: RPC_ENDPOINT or WALLET_PRIVATE_KEY');
    }

    this.connection = new Connection(process.env.RPC_ENDPOINT);
    this.wallet = Keypair.fromSecretKey(bs58.decode(process.env.WALLET_PRIVATE_KEY));
  }
  // TODO: get solana balance - 10 Jan 2024
}

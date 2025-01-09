import { Injectable } from '@nestjs/common';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { LoggerService } from './_logger.service';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { web3 } from '@coral-xyz/anchor';

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
    this.wallet = web3.Keypair.fromSecretKey(bs58.decode(process.env.WALLET_PRIVATE_KEY));
  }

  async getBalance(mintAddress: string): Promise<number> {
    const tokenAccount = new PublicKey(mintAddress);
    const balance = await this.connection.getTokenAccountBalance(tokenAccount);
    this.logger.logInfo(`Balance: ${balance.value.amount}`);
    return parseFloat(balance.value.amount);
  }
}

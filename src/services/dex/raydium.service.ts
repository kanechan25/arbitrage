import { Injectable } from '@nestjs/common';
import { Connection } from '@solana/web3.js';

@Injectable()
export class RaydiumService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(process.env.RPC_ENDPOINT);
  }
}

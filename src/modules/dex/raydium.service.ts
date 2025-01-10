import { Injectable } from '@nestjs/common';
import { Connection } from '@solana/web3.js';
// import { CONFIG } from '../../config/constants';

@Injectable()
export class RaydiumService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(process.env.RPC_ENDPOINT);
  }
}

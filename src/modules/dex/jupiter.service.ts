import { Injectable } from '@nestjs/common';
import {
  Connection,
  Keypair,
  PublicKey,
  SendOptions,
  SimulatedTransactionResponse,
  TransactionInstruction,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js';
import { QuoteResponse, SwapResponse } from '@jup-ag/api';
import JSBI from 'jsbi';

@Injectable()
export class JupiterService {
  private connection: Connection;
  private readonly JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';

  constructor() {
    this.connection = new Connection(process.env.RPC_ENDPOINT);
  }

  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50, // 0.5% default slippage
  ): Promise<QuoteResponse> {
    try {
      const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount: amount.toString(),
        slippageBps: slippageBps.toString(),
        // Optional parameters
        // feeBps: '4', // platform fee
        // onlyDirectRoutes: 'true', // restrict to single hop routes
        // asLegacyTransaction: 'true' // force legacy transaction
      });

      const response = await fetch(`${this.JUPITER_API_BASE}/quote?${params}`);

      if (!response.ok) {
        throw new Error(`Quote failed: ${response.statusText}`);
      }

      const quote: QuoteResponse = await response.json();
      return quote;
    } catch (error) {
      throw new Error(`Jupiter quote failed: ${error.message}`);
    }
  }

  async getSwapTransaction(
    quoteResponse: QuoteResponse,
    userPublicKey: PublicKey,
    wrapAndUnwrapSol = true, // handles native SOL wrapping/unwrapping
  ): Promise<SwapResponse> {
    try {
      const response = await fetch(`${this.JUPITER_API_BASE}/swap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: userPublicKey.toString(),
          wrapAndUnwrapSol,
          // Optional parameters
          // feeAccount: 'fee_account_public_key',
          // computeUnitPriceMicroLamports: 'auto' // or number
        }),
      });

      if (!response.ok) {
        throw new Error(`Swap transaction failed: ${response.statusText}`);
      }

      const swapResponse: SwapResponse = await response.json();
      return swapResponse;
    } catch (error) {
      throw new Error(`Jupiter swap transaction failed: ${error.message}`);
    }
  }

  async executeSwap(
    inputMint: string,
    outputMint: string,
    amount: number,
    wallet: Keypair,
    slippageBps: number = 50,
  ): Promise<{ txId: string; outputAmount: string }> {
    try {
      // 1. Get quote
      const quote = await this.getQuote(inputMint, outputMint, amount, slippageBps);

      // 2. Get swap transaction
      const swapResponse = await this.getSwapTransaction(quote, wallet.publicKey);

      // 3. Deserialize transaction
      const transaction = VersionedTransaction.deserialize(Buffer.from(swapResponse.swapTransaction, 'base64'));

      // 4. Sign transaction
      transaction.sign([wallet]);

      // 5. Get latest blockhash
      const latestBlockhash = await this.connection.getLatestBlockhash('processed');

      // 6. Execute swap with new send and confirm methods
      const txId = await this.sendAndConfirmTransaction(transaction, latestBlockhash);

      return {
        txId,
        outputAmount: quote.outAmount,
      };
    } catch (error) {
      throw new Error(`Swap execution failed: ${error.message}`);
    }
  }
  private async sendAndConfirmTransaction(
    transaction: VersionedTransaction,
    latestBlockhash: { blockhash: string; lastValidBlockHeight: number },
  ): Promise<TransactionSignature> {
    try {
      // Send transaction
      const txId = await this.connection.sendTransaction(transaction, {
        maxRetries: 3,
        skipPreflight: false,
      });

      // Wait for confirmation using newer method
      const confirmation = await this.connection.confirmTransaction(
        {
          signature: txId,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        'processed',
      );

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }

      return txId;
    } catch (error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }
  // Helper method for retrying transactions
  private async retryTransaction(
    transaction: VersionedTransaction,
    options: SendOptions,
    maxRetries: number = 3,
  ): Promise<TransactionSignature> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Get fresh blockhash for retry
        const latestBlockhash = await this.connection.getLatestBlockhash('processed');

        // Update transaction with new blockhash
        transaction.message.recentBlockhash = latestBlockhash.blockhash;

        const txId = await this.connection.sendTransaction(transaction, options);

        // Wait for confirmation
        const confirmation = await this.connection.confirmTransaction(
          {
            signature: txId,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          },
          'confirmed',
        );

        if (!confirmation.value.err) {
          return txId;
        }

        lastError = new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      } catch (error) {
        lastError = error as Error;

        // If this is not the last attempt, wait before retrying
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError || new Error('Transaction failed after all retries');
  }
  // Helper method to build a versioned transaction
  private async buildVersionedTransaction(
    instructions: TransactionInstruction[],
    feePayer: PublicKey,
    additionalSigners: Keypair[] = [],
  ): Promise<VersionedTransaction> {
    // Get latest blockhash
    const latestBlockhash = await this.connection.getLatestBlockhash('processed');

    // Create a message
    const messageV0 = new TransactionMessage({
      payerKey: feePayer,
      recentBlockhash: latestBlockhash.blockhash,
      instructions,
    }).compileToV0Message();

    // Create versioned transaction
    const transaction = new VersionedTransaction(messageV0);

    // Sign transaction if there are additional signers
    if (additionalSigners.length > 0) {
      transaction.sign(additionalSigners);
    }

    return transaction;
  }

  // Helper method to get price
  async getPrice(inputMint: string, outputMint: string, amount: number): Promise<number> {
    try {
      const quote = await this.getQuote(inputMint, outputMint, amount);

      // Convert amounts to numbers for price calculation
      const inAmount = JSBI.BigInt(quote.inAmount);
      const outAmount = JSBI.BigInt(quote.outAmount);

      // Calculate price (outAmount / inAmount)
      return Number(JSBI.divide(outAmount, inAmount));
    } catch (error) {
      throw new Error(`Price check failed: ${error.message}`);
    }
  }
  // Helper method to simulate transaction
  private async simulateTransaction(transaction: VersionedTransaction): Promise<SimulatedTransactionResponse> {
    try {
      const simulation = await this.connection.simulateTransaction(transaction);

      if (simulation.value.err) {
        throw new Error(`Simulation failed: ${JSON.stringify(simulation.value.err)}`);
      }

      return simulation.value;
    } catch (error) {
      throw new Error(`Transaction simulation failed: ${error.message}`);
    }
  }
  // Helper method to get all possible routes
  async getAllRoutes(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50,
  ): Promise<QuoteResponse[]> {
    try {
      const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount: amount.toString(),
        slippageBps: slippageBps.toString(),
        onlyDirectRoutes: 'false',
      });

      const response = await fetch(`${this.JUPITER_API_BASE}/quote?${params}`);

      if (!response.ok) {
        throw new Error(`Routes fetch failed: ${response.statusText}`);
      }

      const quotes: QuoteResponse[] = await response.json();
      return quotes;
    } catch (error) {
      throw new Error(`Get routes failed: ${error.message}`);
    }
  }

  // Method to check if a token pair is supported
  async checkPairSupported(inputMint: string, outputMint: string): Promise<boolean> {
    try {
      // Try to get a quote with a small amount
      await this.getQuote(inputMint, outputMint, 1000); // minimal amount
      return true;
    } catch {
      return false;
    }
  }
}

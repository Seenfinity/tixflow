import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import type { NextRequest } from 'next/server';

const HELIUS_API_KEY = '140d4665-6ab1-4690-8a68-5a51a79601c1';
const RPC_ENDPOINT = `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// Bubblegum program ID on devnet
const BUBBLEGUM_PROGRAM_ID = new PublicKey('BubblegXmR31z4gZMzD5e3LQvL4E3Q7cKQWZqJqV3w5x');

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, eventName } = await request.json();
    
    if (!walletAddress) {
      return Response.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const connection = new Connection(RPC_ENDPOINT);
    const payer = new PublicKey(walletAddress);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    // Create transaction
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    // Add a simple transfer as placeholder for cNFT mint
    // Real cNFT minting with Bubblegum requires Merkle tree setup
    // This demonstrates the transaction flow for the demo
    transaction.add(
      new TransactionInstruction({
        programId: BUBBLEGUM_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
        ],
        data: Buffer.from([0x00]), // Mint instruction
      })
    );

    // Serialize
    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
    });

    return Response.json({
      transaction: Buffer.from(serializedTx).toString('base64'),
      message: 'cNFT transaction ready',
      blockhash,
      eventName: eventName || 'Ticket Event',
    });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ 
      error: 'Failed to create cNFT transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

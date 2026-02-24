import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { createMintToCollectionV1Instruction, createCreateTreeInstruction, createMintV1Instruction } from '@metaplex-foundation/mpl-bubblegum';
import type { NextRequest } from 'next/server';

const HELIUS_API_KEY = '140d4665-6ab1-4690-8a68-5a51a79601c1';
const RPC_ENDPOINT = `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// Bubblegum program IDs on devnet
const BUBBLEGUM_PROGRAM_ID = new PublicKey('BubblegXmR31z4gZMzD5e3LQvL4E3Q7cKQWZqJqV3w5x');
const COMPRESSION_PROGRAM_ID = new PublicKey('Compress8wXKczk4L4xFxYPBLG4xCzfwSCTNY');
const NOISE_PROGRAM_ID = new PublicKey('NoisXmR31z4gZMzD5e3LQvL4E3Q7cKQWZqJqV3w5x');

// Merkle tree - using an existing one or creating new
const MERKLE_TREE = new PublicKey('TreeXmR31z4gZMzD5e3LQvL4E3Q7cKQWZqJqV3w5x');

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, eventName } = await request.json();
    
    if (!walletAddress) {
      return Response.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const connection = new Connection(RPC_ENDPOINT);
    const payer = new PublicKey(walletAddress);

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Create transaction
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    // For demo purposes, we'll create a simple transfer that simulates cNFT minting
    // In production, you'd use Bubblegum's createMintV1Instruction
    
    // Add a simple transfer as placeholder for cNFT mint
    // Real cNFT minting requires Merkle tree setup which is complex
    transaction.add(
      // This is a placeholder - real cNFT mint needs Bubblegum instructions
      new TransactionInstruction({
        programId: BUBBLEGUM_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
        ],
        data: Buffer.from([0x01]), // Mint instruction
      })
    );

    // Serialize the transaction
    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
    });

    return Response.json({
      transaction: Buffer.from(serializedTx).toString('base64'),
      message: 'Transaction ready for cNFT minting',
      blockhash,
      lastValidBlockHeight,
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

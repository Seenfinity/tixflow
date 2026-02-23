import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import type { NextRequest } from 'next/server';

const HELIUS_API_KEY = '140d4665-6ab1-4690-8a68-5a51a79601c1';
const RPC_ENDPOINT = `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// TixFlow NFT Collection - use existing collection
const TIXFLOW_MINT = "9kTELGRafmpKygQqahhHbrDNaeA33tesobcbuicBKirL";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, eventName } = await request.json();
    
    if (!walletAddress) {
      return Response.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const connection = new Connection(RPC_ENDPOINT);
    const buyerPubkey = new PublicKey(walletAddress);

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Create a simple transfer transaction to demonstrate on-chain activity
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = buyerPubkey;

    // Add a tiny transfer to register purchase on-chain
    // In production: mint cNFT via Bubblegum
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: buyerPubkey,
        toPubkey: new PublicKey('CwgNZ4N3F1r8QW7HnX2QX5Kp5xJ6J5v6X5xJ6J5v6X5x'), // burn address for demo
        lamports: 1000, // 0.001 SOL - demo fee
      })
    );

    // Get the raw transaction message for signing
    const messageHex = transaction.serializeMessage().toString('hex');

    return Response.json({
      transactionMessage: messageHex,
      message: 'Transaction ready for signing with Phantom',
      blockhash,
      lastValidBlockHeight,
      nftMint: TIXFLOW_MINT,
      eventName: eventName || 'TixFlow Ticket',
    });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ 
      error: 'Failed to create transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

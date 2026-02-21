import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import type { NextRequest } from 'next/server';

const HELIUS_API_KEY = '140d4665-6ab1-4690-8a68-5a51a79601c1';
const RPC_ENDPOINT = `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// TixFlow NFT Collection
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

    // Create a simple transaction that proves the mint happened
    // In production: you'd create a cNFT via Bubblegum here
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = buyerPubkey;

    // Add a tiny transfer to "register" the purchase on-chain
    // This is a demo - in production: mint cNFT via Bubblegum program
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: buyerPubkey,
        toPubkey: new PublicKey('Cw8mR4o3iihnNDrTWkTXXR4jEucCRqt2kufCJcCFyra'), // burn address for demo
        lamports: 1000, // 0.001 SOL - demo fee
      })
    );

    // Serialize for client to sign
    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
    });

    return Response.json({
      transaction: Buffer.from(serializedTx).toString('base64'),
      message: 'Transaction ready for signing',
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

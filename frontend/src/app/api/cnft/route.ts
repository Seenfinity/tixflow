import type { NextRequest } from 'next/server';

const HELIUS_API_KEY = '140d4665-6ab1-4690-8a68-5a51a79601c1';
const RPC_ENDPOINT = `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, eventName } = await request.json();
    
    if (!walletAddress) {
      return Response.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Fetch blockhash from Helius
    const response = await fetch(RPC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getLatestBlockhash'
      })
    });
    
    const data = await response.json();
    const blockhash = data.result?.value?.blockhash;
    
    if (!blockhash) {
      throw new Error('Failed to get blockhash');
    }

    // Return transaction template for cNFT mint
    // The frontend will sign and send this
    return Response.json({
      blockhash,
      eventName: eventName || 'Ticket Event',
      message: 'Ready for cNFT mint - transaction will be created on frontend',
      // Using a dummy instruction to represent cNFT mint
      instructionData: 'cNFT mint instruction placeholder'
    });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ 
      error: 'Failed to prepare cNFT transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

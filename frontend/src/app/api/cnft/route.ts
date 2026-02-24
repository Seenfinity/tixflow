import type { NextRequest } from 'next/server';

const CROSSMINT_API_KEY = 'sk_production_5YU78z5TstvEVax6kVp18JrB9rnKySXkuN6fEUQ8Exz1N1UbvsReoJK5hHNbjfZiyVBHwN8cjHt9ZPgBhtdDeRToGBMW5fZhwPhaerXXfyWV2UNUqgqEUHSRnaKWaWBpi2XEyMbhBHU9ad6yGnzYxjSSuQSHW6t3XntqcDoxFpsqfwRdAosUpWr8tEuQDqU97gXnrnUKMLJNpPsZqUaTQiq9';
const COLLECTION_ID = 'cf6cf507-6475-46f1-9d01-0185919965cd';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, eventName } = await request.json();
    
    if (!walletAddress) {
      return Response.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Mint NFT using CrossMint API
    const response = await fetch(
      `https://www.crossmint.com/api/2022-06-09/collections/${COLLECTION_ID}/nfts`,
      {
        method: 'POST',
        headers: {
          'x-client-secret': CROSSMINT_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metadata: {
            name: eventName || 'TixFlow Ticket',
            description: 'Event ticket purchased via TixFlow AI Assistant',
            image: 'https://utfs.io/f/75a2dbfc-c0f0-4359-b45c-fbd826026b30-gnltz7.jpg'
          },
          recipient: `solana:${walletAddress}`
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      return Response.json({ error: error.message || 'Failed to mint NFT' }, { status: response.status });
    }
    
    const result = await response.json();
    
    // Return the mint result
    return Response.json({
      success: true,
      nftId: result.id,
      mintHash: result.onChain?.mintHash,
      txId: result.onChain?.txId,
      status: result.onChain?.status,
      message: 'NFT minted successfully!'
    });

  } catch (error) {
    console.error('Mint Error:', error);
    return Response.json({ 
      error: 'Failed to mint NFT',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

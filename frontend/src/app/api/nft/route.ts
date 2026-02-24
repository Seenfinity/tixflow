import type { NextRequest } from 'next/server';

const HELIUS_API_KEY = '140d4665-6ab1-4690-8a68-5a51a79601c1';

export async function POST(request: NextRequest) {
  return Response.json({ 
    message: 'NFT route - use /api/cnft for CrossMint minting',
    redirect: '/api/cnft'
  });
}

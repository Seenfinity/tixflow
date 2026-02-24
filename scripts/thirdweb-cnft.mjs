// Create cNFT using Thirdweb SDK
import { ThirdwebSDK } from '@thirdweb-dev/solana';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';

const HELIUS_RPC = 'https://devnet.helius-rpc.com/?api-key=140d4665-6ab1-4690-8a68-5a51a79601c1';

async function main() {
  // Load wallet
  const walletData = JSON.parse(fs.readFileSync('/tmp/wallet_key.json', 'utf-8'));
  const wallet = Keypair.fromSecretKey(Buffer.from(walletData));
  
  console.log('=== Creating cNFT with Thirdweb ===\n');
  console.log('Wallet:', wallet.publicKey.toString());
  
  try {
    // Initialize SDK
    const sdk = ThirdwebSDK.fromNetwork('devnet');
    
    // Connect wallet
    sdk.wallet.connect(wallet);
    console.log('✅ Wallet connected');
    
    // Deploy NFT Collection
    console.log('\nDeploying NFT Collection...');
    const collectionAddress = await sdk.deployer.createNftCollection({
      name: "TixFlow Tickets",
      symbol: "TIX",
      description: "Event tickets for TixFlow",
      image: "https://example.com/ticket.png",
    });
    
    console.log('✅ Collection deployed!');
    console.log('Collection Address:', collectionAddress);
    
    // Mint NFT
    console.log('\nMinting NFT...');
    const nft = await sdk.nfts.mintTo({
      collectionAddress,
      metadata: {
        name: "Demo Ticket",
        description: "Event ticket for TixFlow",
        image: "https://example.com/ticket.png",
      },
      quantity: 1,
    });
    
    console.log('✅ NFT Minted!');
    console.log('NFT Address:', nft.mint.address);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();

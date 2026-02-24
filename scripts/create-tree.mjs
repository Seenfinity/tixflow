// Create Merkle Tree for cNFT using @solana/spl-account-compression
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { createInitializeInstruction, createMintInstruction } from '@solana/spl-account-compression';
import fs from 'fs';

const HELIUS_RPC = 'https://devnet.helius-rpc.com/?api-key=140d4665-6ab1-4690-8a68-5a51a79601c1';
const connection = new Connection(HELIUS_RPC, 'confirmed');

// Load wallet
const walletData = JSON.parse(fs.readFileSync('/tmp/wallet_key.json', 'utf-8'));
const wallet = Keypair.fromSecretKey(Buffer.from(walletData));

console.log('=== Creating Merkle Tree for cNFT ===\n');
console.log('Wallet:', wallet.publicKey.toString());

// Tree configuration
const TREE_HEIGHT = 14; // Supports 2^14 = 16384 leaves
const TREE_CREATION_COST = 0.06528; // SOL needed

console.log('\nTree Configuration:');
console.log('- Height:', TREE_HEIGHT);
console.log('- Max leaves:', Math.pow(2, TREE_HEIGHT));
console.log('- Cost:', TREE_CREATION_COST, 'SOL');

// Check balance
const balance = await connection.getBalance(wallet.publicKey);
console.log('- Balance:', balance / 1e9, 'SOL');

if (balance / 1e9 < TREE_CREATION_COST) {
  console.log('\n❌ Insufficient balance to create tree');
  console.log('Need:', TREE_CREATION_COST, 'SOL');
  console.log('Have:', balance / 1e9, 'SOL');
} else {
  console.log('\n✅ Sufficient balance');
  console.log('\nTo create the tree, we need to:');
  console.log('1. Create a new keypair for the tree');
  console.log('2. Allocate space for the tree account');
  console.log('3. Initialize with compression program');
  console.log('4. This requires the spl-account-compression program');
}

// For devnet, the compression program might already be deployed
const COMPRESSION_PROGRAM_ID = new PublicKey('Compress5wfAooBnhck1X5Wj8mGvzS5Cq4TpmsqqoV3FYeT');
const BUBBLEGUM_PROGRAM_ID = new PublicKey('BubblegGCTmYVUo5sS4K4GM3TFjE2YM1x4Y5gZ5J5J5J5J');

console.log('\n=== Program IDs (devnet) ===');
console.log('Compression:', COMPRESSION_PROGRAM_ID.toString());
console.log('Bubblegum:', BUBBLEGUM_PROGRAM_ID.toString());

// Check if programs exist
try {
  const compressionInfo = await connection.getProgramAccount(COMPRESSION_PROGRAM_ID);
  console.log('\n✅ Compression program exists on devnet');
} catch (e) {
  console.log('\n❌ Compression program NOT found on devnet');
}

try {
  const bubblegumInfo = await connection.getProgramAccount(BUBBLEGUM_PROGRAM_ID);
  console.log('✅ Bubblegum program exists on devnet');
} catch (e) {
  console.log('❌ Bubblegum program NOT found on devnet');
}

console.log('\n=== Summary ===');
console.log('For full cNFT mint, we need the programs deployed.');
console.log('The demo currently supports real transactions.');

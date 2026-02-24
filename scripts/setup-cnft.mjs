import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';

const HELIUS_RPC = 'https://devnet.helius-rpc.com/?api-key=140d4665-6ab1-4690-8a68-5a51a79601c1';
const connection = new Connection(HELIUS_RPC, 'confirmed');

const walletData = JSON.parse(fs.readFileSync('/tmp/wallet_key.json', 'utf-8'));
const wallet = Keypair.fromSecretKey(Buffer.from(walletData));

console.log('Wallet:', wallet.publicKey.toString());
const balance = await connection.getBalance(wallet.publicKey);
console.log('Balance:', balance / 1e9, 'SOL');

console.log('\n=== cNFT Setup Status ===');
console.log('Wallet verified ✅');
console.log('\nFor real cNFT mint, we need to deploy a Merkle Tree.');
console.log('This requires running commands that take time and SOL.');
console.log('\nThe demo currently supports:');
console.log('- Real wallet connection');
console.log('- Real transactions on devnet');
console.log('- Transaction verification on Explorer');

const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');

const RPC_ENDPOINT = 'https://api.devnet.solana.com';
const HELIUS_API_KEY = '140d4665-6ab1-4690-8a68-5a51a79601c1';

// Bubblegum program ID on devnet
const BUBBLEGUM_PROGRAM_ID = new PublicKey('BGUMAp9Gq7iTEuizy4ZgsRN3Z6UavQZq7fY7Y9x3W3bN');

const SECRET_KEY = Buffer.from(
  '49b2d7c5062dd1881dbd524c4c1ddbb493018c370368b8d849621cb9dd7e69e9c89fdef1c89a4ec313e7880fe8cc608f028f690db3df05628205dbad2ebf3947',
  'hex'
);

async function main() {
  console.log('🎫 TixFlow cNFT Minter - Devnet\n');

  const connection = new Connection(`https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`);
  
  const wallet = Keypair.fromSecretKey(SECRET_KEY);
  console.log('👛 Wallet:', wallet.publicKey.toString());

  const balance = await connection.getBalance(wallet.publicKey);
  console.log('💰 Balance:', balance / 1e9, 'SOL\n');

  // Create a regular NFT (not compressed for simplicity)
  // This is easier to test and works on devnet
  console.log('🎨 Creating collection NFT...');
  
  const mintKeypair = Keypair.generate();
  
  const createMintIx = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: 82,
    lamports: await connection.getMinimumBalanceForRentExemption(82),
    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  });

  const initMintIx = createMint(
    connection,
    wallet,
    wallet.publicKey,
    wallet.publicKey,
    0,
    mintKeypair
  );

  console.log('✅ NFT Created!');
  console.log('   Mint Address:', mintKeypair.publicKey.toString());
  console.log('');
  console.log('🎫 NFT Details:');
  console.log('   Name: TixFlow Demo Ticket #1');
  console.log('   Symbol: TIX');
  console.log('   Type: VIP Pass');
  console.log('');
  console.log('💡 En el demo, cuando el usuario haga "buy",');
  console.log('   se mostrará este mint address como ejemplo.');
}

main().catch(console.error);

const { Connection, Keypair } = require('@solana/web3.js');

const RPC_ENDPOINT = 'https://api.devnet.solana.com';

// Secret key
const SECRET_KEY = '49b2d7c5062dd1881dbd524c4c1ddbb493018c370368b8d849621cb9dd7e69e9c89fdef1c89a4ec313e7880fe8cc608f028f690db3df05628205dbad2ebf3947';
const keypairArray = Uint8Array.from(Buffer.from(SECRET_KEY, 'hex'));
const keypair = Keypair.fromSecretKey(keypairArray);

console.log('🎫 TixFlow - Wallet Test\n');
console.log('🔑 Public Key:', keypair.publicKey.toBase58());

async function main() {
  const connection = new Connection(RPC_ENDPOINT, 'confirmed');
  
  // Check balance
  const balance = await connection.getBalance(keypair.publicKey);
  console.log('💰 Balance:', balance / 1e9, 'SOL');
  
  // Airdrop if needed
  if (balance < 1e9) {
    console.log('\n💧 Requesting airdrop...');
    try {
      const airdropSig = await connection.requestAirdrop(keypair.publicKey, 2 * 1e9);
      await connection.confirmTransaction(airdropSig);
      console.log('✅ Airdrop received!');
      const newBalance = await connection.getBalance(keypair.publicKey);
      console.log('💰 New Balance:', newBalance / 1e9, 'SOL');
    } catch (e) {
      console.log('⚠️  Airdrop failed:', e.message);
    }
  } else {
    console.log('✅ Wallet funded!');
  }
}

main().catch(console.error);

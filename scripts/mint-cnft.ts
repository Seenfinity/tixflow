import { createTree, mintV1, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, publicKey, sol } from '@metaplex-foundation/umi'
import { keypairIdentity } from '@metaplex-foundation/umi-signer-keypair'
import fs from 'fs'

const RPC_ENDPOINT = 'https://api.devnet.solana.com'
const HELIUS_API_KEY = '140d4665-6ab1-4690-8a68-5a51a79601c1'

const SECRET_KEY = '49b2d7c5062dd1881dbd524c4c1ddbb493018c370368b8d849621cb9dd7e69e9c89fdef1c89a4ec313e7880fe8cc608f028f690db3df05628205dbad2ebf3947'

async function main() {
  console.log('🎫 TixFlow cNFT Minter - Devnet\n')

  const keypairArray = new Uint8Array(
    SECRET_KEY.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  )

  const umi = createUmi(RPC_ENDPOINT.replace('devnet', `devnet?api-key=${HELIUS_API_KEY}`))
    .use(mplBubblegum())

  const signer = generateSigner(umi)
  
  umi.use(keypairIdentity({
    publicKey: signer.publicKey,
    secretKey: keypairArray
  }))

  console.log('👛 Wallet:', signer.publicKey)

  // Check balance
  const balance = await umi.rpc.getBalance(signer.publicKey)
  console.log('💰 Balance:', balance.basisPoints / 1e9, 'SOL\n')

  // Create Merkle Tree
  console.log('🌲 Creating Merkle Tree (depth=8)...')
  const merkleTree = generateSigner(umi)
  
  await createTree(umi, {
    merkleTree,
    maxDepth: 8,
    maxBufferSize: 8,
    public: false,
  }).sendAndConfirm(umi)
  
  console.log('✅ Tree created!')
  console.log('   Address:', merkleTree.publicKey)
  console.log('')

  // Simple metadata URI (placeholder)
  const metadataUri = 'https://example.com/ticket.json'

  // Mint cNFT
  console.log('🎫 Minting cNFT...')
  
  await mintV1(umi, {
    merkleTree: merkleTree.publicKey,
    metadataUri,
    metadata: {
      name: 'TixFlow Ticket #1',
      symbol: 'TIX',
      uri: metadataUri,
      creators: null,
      sellerFeeBasisPoints: 0,
      collection: null,
      uses: null,
    },
    leafOwner: signer.publicKey,
    compress: true,
  }).sendAndConfirm(umi)

  console.log('✅ cNFT Minted!')
  console.log('')
  console.log('🎉 Setup completo!')
  console.log('   - Merkle Tree:', merkleTree.publicKey)
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})

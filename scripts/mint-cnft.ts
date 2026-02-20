import {
  createTree,
  mintV1,
  mplBubblegum,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { keypairIdentity } from '@metaplex-foundation/umi-signer-keypair'
import fs from 'fs'

// Devnet RPC
const RPC_ENDPOINT = 'https://api.devnet.solana.com'

// Your wallet secret key (64 hex chars)
const SECRET_KEY = '49b2d7c5062dd1881dbd524c4c1ddbb493018c370368b8d849621cb9dd7e69e9c89fdef1c89a4ec313e7880fe8cc608f028f690db3df05628205dbad2ebf3947'

// Convert hex to Uint8Array
const keypairArray = new Uint8Array(SECRET_KEY.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

async function main() {
  console.log('🎫 TixFlow cNFT Minter - Devnet\n')

  // Setup Umi
  const umi = createUmi(RPC_ENDPOINT)
    .use(mplBubblegum())
    .use(mplTokenMetadata())
    .use(irysUploader({
      address: 'https://devnet.irys.xyz',
    }))

  // Load wallet from secret key
  const signer = generateSigner(umi)
  
  // Use keypairIdentity with the secret key
  const keypair = {
    publicKey: publicKey(keypairArray.slice(0, 32)),
    secretKey: keypairArray
  }
  
  umi.use(keypairIdentity(keypair))

  console.log('� wallet:', umi.identity.publicKey)

  // Airdrop SOL (devnet only)
  try {
    console.log('💧 Requesting airdrop...')
    await umi.rpc.airdrop(umi.identity.publicKey, sol(2))
    console.log('✅ Airdrop received!\n')
  } catch (e) {
    console.log('⚠️  Airdrop failed or already has funds, continuing...\n')
  }

  // Create Merkle Tree
  console.log('🌲 Creating Merkle Tree (depth=8, capacity=256)...')
  const merkleTree = generateSigner(umi)
  
  await createTree(umi, {
    merkleTree,
    maxDepth: 8,
    maxBufferSize: 8,
    public: false,
  })
  
  console.log('✅ Tree created!')
  console.log('   Tree address:', merkleTree.publicKey)
  console.log('')

  // Upload metadata to Irys
  const metadata = {
    name: 'TixFlow Ticket #1',
    description: 'VIP Access Token for TixFlow Events',
    image: 'https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    attributes: [
      { trait_type: 'Event', value: 'TixFlow Demo' },
      { trait_type: 'Type', value: 'VIP Pass' },
    ],
  }

  console.log('📤 Uploading metadata to Irys...')
  const metadataUri = await umi.uploader.uploadJson(metadata)
  console.log('✅ Metadata uploaded!')
  console.log('   URI:', metadataUri)
  console.log('')

  // Mint cNFT
  console.log('🎫 Minting cNFT...')
  const mint = generateSigner(umi)
  
  await mintV1(umi, {
    merkleTree: merkleTree.publicKey,
    metadataUri,
    metadata: {
      name: 'TixFlow Ticket #1',
      symbol: 'TIX',
      uri: metadataUri,
      creators: [{ address: umi.identity.publicKey, share: 100, verified: false }],
      sellerFeeBasisPoints: 0,
    },
    leafOwner: umi.identity.publicKey,
    compress: true,
  })

  console.log('✅ cNFT Minted!')
  console.log('')
  console.log('🎉 Setup completo!')
  console.log('   - Merkle Tree:', merkleTree.publicKey)
  console.log('   - cNFT Minted successfully')
}

main().catch(console.error)

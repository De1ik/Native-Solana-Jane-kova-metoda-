// Configuration template for Janecek Voting Client
// Copy this file to config.ts and update with your values

import { PublicKey, clusterApiUrl } from '@solana/web3.js';

export const CONFIG = {
  // Solana network configuration
  network: 'devnet', // 'devnet', 'testnet', or 'mainnet-beta'
  rpcUrl: clusterApiUrl('devnet'), // or custom RPC URL
  
  // Program configuration
  programId: new PublicKey('6LKL9MnuNGd3fpEp5U3P9Sm8LW5YuHasKRp8Jwyp9Hhy'), // Replace with your deployed program ID
  
  // Wallet configuration
  // You can use a keypair file or generate a new one
  walletPath: './wallet.json', // Path to your wallet keypair file
  
  // Transaction configuration
  commitment: 'confirmed' as const, // 'processed', 'confirmed', or 'finalized'
  maxRetries: 3,
  
  // Poll configuration
  defaultRegistrationPeriod: 24 * 60 * 60, // 24 hours in seconds
  defaultVotingPeriod: 7 * 24 * 60 * 60, // 7 days in seconds
};

// Example usage:
// import { CONFIG } from './config';
// const connection = new Connection(CONFIG.rpcUrl, CONFIG.commitment);
// const wallet = Keypair.fromSecretKey(/* load from file or generate */);
// const client = new JanecekVotingClient({
//   connection,
//   programId: CONFIG.programId,
//   wallet,
// });

import { PublicKey } from '@solana/web3.js';

/**
 * Voting phases enum matching the Rust VotingPhase
 */
export enum VotingPhase {
  Registration = 0,
  Voting = 1,
  Results = 2,
}

/**
 * Vote types enum matching the Rust VoteType
 */
export enum VoteType {
  Positive = 0,
  Negative = 1,
}

/**
 * Poll state structure matching the Rust PollState
 */
export interface PollState {
  discriminator: string;
  title: string;
  description: string;
  phase: VotingPhase;
  parties: PublicKey[];
  owner: PublicKey;
  expectedNewOwner: PublicKey;
  createdAt: number;
  votingStartAt: number;
}

/**
 * Party account structure matching the Rust PartyAccount
 */
export interface PartyAccount {
  discriminator: string;
  pollId: PublicKey;
  title: string;
  positiveVotes: number;
  negativeVotes: number;
}

/**
 * Voter account structure matching the Rust VoterAccount
 */
export interface VoterAccount {
  discriminator: string;
  pollKey: PublicKey;
  voterKey: PublicKey;
  positiveUsed: number;
  negativeUsed: number;
  votedParties: PublicKey[];
}

/**
 * Custom error types matching the Rust JanecekError
 */
export enum JanecekError {
  InvalidInstruction = 0,
  InvalidDataLength = 1,
  RegistrationPhaseTooShort = 2,
  VotingPeriodFinished = 3,
  NoPositiveVoice = 4,
  NoNegativeVoice = 5,
  AlreadyVoted = 6,
  MustUseAllPositiveVoices = 7,
}

/**
 * Instruction discriminators matching the Rust instruction enum
 */
export enum InstructionDiscriminator {
  CreatePoll = 0,
  CreateParty = 1,
  InitiateOwnerTransfer = 2,
  AcceptOwnerTransfer = 3,
  StartVoting = 4,
  Vote = 5,
  EndVoting = 6,
}

/**
 * Configuration for the voting client
 */
export interface VotingClientConfig {
  programId: PublicKey;
  connection: any; // Connection from @solana/web3.js
  wallet: any; // Wallet/Keypair from @solana/web3.js
}

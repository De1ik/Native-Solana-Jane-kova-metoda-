import { PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { PollState, PartyAccount, VoterAccount, VotingPhase, VoteType } from './types';
import { sha256 } from "@noble/hashes/sha256";






/**
 * Deserialization schemas for account data
 */
const PollStateSchema = new Map([
  [PollState, {
    kind: 'struct',
    fields: [
      ['discriminator', 'string'],
      ['title', 'string'],
      ['description', 'string'],
      ['phase', 'u8'],
      ['parties', ['vector', PublicKey]],
      ['owner', PublicKey],
      ['expectedNewOwner', PublicKey],
      ['createdAt', 'i64'],
      ['votingStartAt', 'i64'],
    ],
  }],
]);

const PartyAccountSchema = new Map([
  [Object, {
    kind: 'struct',
    fields: [
      ['discriminator', 'string'],
      ['pollId', PublicKey],
      ['title', 'string'],
      ['positiveVotes', 'u64'],
      ['negativeVotes', 'u64'],
    ],
  }],
]);

const VoterAccountSchema = new Map([
  [Object, {
    kind: 'struct',
    fields: [
      ['discriminator', 'string'],
      ['pollKey', PublicKey],
      ['voterKey', PublicKey],
      ['positiveUsed', 'u8'],
      ['negativeUsed', 'u8'],
      ['votedParties', ['vector', PublicKey]],
    ],
  }],
]);

/**
 * Utility functions for PDA derivation and account management
 */
export class JanecekUtils {
  /**
   * Derive poll PDA using title and description hashes
   */
  static derivePollPda(
    programId: PublicKey,
    title: string,
    description: string
  ): [PublicKey, number] {
    const titleHash = this.hashString(title);
    const descriptionHash = this.hashString(description);
    
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('poll'),
        Buffer.from(titleHash),
        Buffer.from(descriptionHash),
      ],
      programId
    );
  }

  /**
   * Derive party PDA using poll PDA and party title hash
   */
  static derivePartyPda(
    programId: PublicKey,
    pollPda: PublicKey,
    partyTitle: string
  ): [PublicKey, number] {
    const partyTitleHash = this.hashString(partyTitle);
    
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('party'),
        pollPda.toBuffer(),
        Buffer.from(partyTitleHash),
      ],
      programId
    );
  }

  /**
   * Derive voter PDA using poll PDA and voter public key
   */
  static deriveVoterPda(
    programId: PublicKey,
    pollPda: PublicKey,
    voterPubkey: PublicKey
  ): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('voter'),
        pollPda.toBuffer(),
        voterPubkey.toBuffer(),
      ],
      programId
    );
  }

  /**
   * Calculate account size for poll state
   */
  static getPollAccountSize(title: string, description: string, partiesCount: number): number {
    return (4 + 'poll'.length) 
      + (4 + title.length) 
      + (4 + description.length)
      + 1
      + 4 + (32 * partiesCount)
      + 32
      + 32
      + 8
      + 8;
  }

  /**
   * Calculate account size for party account
   */
  static getPartyAccountSize(title: string): number {
    return (4 + 'party'.length) 
      + 32
      + (4 + title.length)
      + 8
      + 8;
  }

  /**
   * Calculate account size for voter account
   */
  static getVoterAccountSize(partiesCount: number): number {
    return (4 + 'voter'.length)
      + 32
      + 32
      + 1
      + 1
      + 4 + (32 * partiesCount);
  }

  /**
   * Deserialize poll state from account data
   */
  static deserializePollState(data: Buffer): PollState {
    const deserialized = deserialize(PollStateSchema, Object, data) as any;
    return {
      discriminator: deserialized.discriminator,
      title: deserialized.title,
      description: deserialized.description,
      phase: deserialized.phase as VotingPhase,
      parties: deserialized.parties,
      owner: deserialized.owner,
      expectedNewOwner: deserialized.expectedNewOwner,
      createdAt: deserialized.createdAt,
      votingStartAt: deserialized.votingStartAt,
    };
  }

  /**
   * Deserialize party account from account data
   */
  static deserializePartyAccount(data: Buffer): PartyAccount {
    const deserialized = deserialize(PartyAccountSchema, Object, data) as any;
    return {
      discriminator: deserialized.discriminator,
      pollId: deserialized.pollId,
      title: deserialized.title,
      positiveVotes: deserialized.positiveVotes,
      negativeVotes: deserialized.negativeVotes,
    };
  }

  /**
   * Deserialize voter account from account data
   */
  static deserializeVoterAccount(data: Buffer): VoterAccount {
    const deserialized = deserialize(VoterAccountSchema, Object, data) as any;
    return {
      discriminator: deserialized.discriminator,
      pollKey: deserialized.pollKey,
      voterKey: deserialized.voterKey,
      positiveUsed: deserialized.positiveUsed,
      negativeUsed: deserialized.negativeUsed,
      votedParties: deserialized.votedParties,
    };
  }

  /**
   * Simple hash function for strings (matches Rust implementation)
   * Note: This is a simplified implementation. For production use,
   * you should use a proper cryptographic hash function that matches
   * the exact Rust implementation in your program.
   */
  static hashString(input: string): Buffer {
    const hashBytes = sha256(new TextEncoder().encode(input)); // returns Uint8Array(32)
    return Buffer.from(hashBytes); // бинарные байты
  }

  /**
   * Check if an account exists and is initialized
   */
  static async isAccountInitialized(
    connection: any,
    accountPubkey: PublicKey
  ): Promise<boolean> {
    try {
      const accountInfo = await connection.getAccountInfo(accountPubkey);
      if (!accountInfo) return false;
      
      // Check if account data is all zeros (uninitialized)
      return !accountInfo.data.every((byte: number) => byte === 0);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get account info and deserialize data
   */
  static async getAccountData<T>(
    connection: any,
    accountPubkey: PublicKey,
    deserializer: (data: Buffer) => T
  ): Promise<T | null> {
    try {
      const accountInfo = await connection.getAccountInfo(accountPubkey);
      if (!accountInfo) return null;
      
      return deserializer(accountInfo.data);
    } catch (error) {
      return null;
    }
  }
}


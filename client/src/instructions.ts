import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { serialize } from 'borsh';
import { 
  InstructionDiscriminator, 
  VoteType, 
  PollState, 
  PartyAccount, 
  VoterAccount 
} from './types';

/**
 * Serialization schemas for instruction payloads
 */
const CreatePollSchema = new Map([
  [Object, {
    kind: 'struct',
    fields: [
      ['title', 'string'],
      ['description', 'string'],
    ],
  }],
]);

const CreatePartySchema = new Map([
  [Object, {
    kind: 'struct',
    fields: [
      ['title', 'string'],
    ],
  }],
]);

const InitiateOwnerTransferSchema = new Map([
  [Object, {
    kind: 'struct',
    fields: [
      ['newOwner', [32]],
    ],
  }],
]);

const VoteSchema = new Map([
  [Object, {
    kind: 'struct',
    fields: [
      ['voteType', 'u8'],
    ],
  }],
]);

/**
 * Instruction builder class for Janecek Voting program
 */
export class JanecekInstructions {
  /**
   * Create a poll instruction
   */
  static createPoll(
    programId: PublicKey,
    pollPda: PublicKey,
    payer: PublicKey,
    title: string,
    description: string
  ): TransactionInstruction {
    const payload = {
      title,
      description,
    };

    const data = Buffer.alloc(1 + serialize(CreatePollSchema, payload).length);
    data.writeUInt8(InstructionDiscriminator.CreatePoll, 0);
    data.set(serialize(CreatePollSchema, payload), 1);

    return new TransactionInstruction({
      keys: [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: pollPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // System program
      ],
      programId,
      data,
    });
  }

  /**
   * Create a party instruction
   */
  static createParty(
    programId: PublicKey,
    pollPda: PublicKey,
    partyPda: PublicKey,
    payer: PublicKey,
    title: string
  ): TransactionInstruction {
    const payload = {
      title,
    };

    const data = Buffer.alloc(1 + serialize(CreatePartySchema, payload).length);
    data.writeUInt8(InstructionDiscriminator.CreateParty, 0);
    data.set(serialize(CreatePartySchema, payload), 1);

    return new TransactionInstruction({
      keys: [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: pollPda, isSigner: false, isWritable: true },
        { pubkey: partyPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // System program
      ],
      programId,
      data,
    });
  }

  /**
   * Initiate owner transfer instruction
   */
  static initiateOwnerTransfer(
    programId: PublicKey,
    pollPda: PublicKey,
    payer: PublicKey,
    newOwner: PublicKey
  ): TransactionInstruction {
    const payload = {
      newOwner: newOwner.toBytes(),
    };

    const data = Buffer.alloc(1 + serialize(InitiateOwnerTransferSchema, payload).length);
    data.writeUInt8(InstructionDiscriminator.InitiateOwnerTransfer, 0);
    data.set(serialize(InitiateOwnerTransferSchema, payload), 1);

    return new TransactionInstruction({
      keys: [
        { pubkey: payer, isSigner: true, isWritable: false },
        { pubkey: pollPda, isSigner: false, isWritable: true },
      ],
      programId,
      data,
    });
  }

  /**
   * Accept owner transfer instruction
   */
  static acceptOwnerTransfer(
    programId: PublicKey,
    pollPda: PublicKey,
    payer: PublicKey
  ): TransactionInstruction {
    const data = Buffer.alloc(1);
    data.writeUInt8(InstructionDiscriminator.AcceptOwnerTransfer, 0);

    return new TransactionInstruction({
      keys: [
        { pubkey: payer, isSigner: true, isWritable: false },
        { pubkey: pollPda, isSigner: false, isWritable: true },
      ],
      programId,
      data,
    });
  }

  /**
   * Start voting instruction
   */
  static startVoting(
    programId: PublicKey,
    pollPda: PublicKey,
    payer: PublicKey
  ): TransactionInstruction {
    const data = Buffer.alloc(1);
    data.writeUInt8(InstructionDiscriminator.StartVoting, 0);

    return new TransactionInstruction({
      keys: [
        { pubkey: payer, isSigner: true, isWritable: false },
        { pubkey: pollPda, isSigner: false, isWritable: true },
      ],
      programId,
      data,
    });
  }

  /**
   * Vote instruction
   */
  static vote(
    programId: PublicKey,
    pollPda: PublicKey,
    partyPda: PublicKey,
    voterPda: PublicKey,
    payer: PublicKey,
    voteType: VoteType
  ): TransactionInstruction {
    const payload = {
      voteType: voteType,
    };

    const data = Buffer.alloc(1 + serialize(VoteSchema, payload).length);
    data.writeUInt8(InstructionDiscriminator.Vote, 0);
    data.set(serialize(VoteSchema, payload), 1);

    return new TransactionInstruction({
      keys: [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: pollPda, isSigner: false, isWritable: true },
        { pubkey: partyPda, isSigner: false, isWritable: true },
        { pubkey: voterPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // System program
      ],
      programId,
      data,
    });
  }

  /**
   * End voting instruction
   */
  static endVoting(
    programId: PublicKey,
    pollPda: PublicKey,
    payer: PublicKey
  ): TransactionInstruction {
    const data = Buffer.alloc(1);
    data.writeUInt8(InstructionDiscriminator.EndVoting, 0);

    return new TransactionInstruction({
      keys: [
        { pubkey: payer, isSigner: true, isWritable: false },
        { pubkey: pollPda, isSigner: false, isWritable: true },
      ],
      programId,
      data,
    });
  }
}

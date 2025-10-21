import { 
  Connection, 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  SystemProgram,
  sendAndConfirmTransaction,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  VotingClientConfig, 
  PollState, 
  PartyAccount, 
  VoterAccount, 
  VoteType, 
  VotingPhase 
} from './types';
import { JanecekInstructions } from './instructions';
import { JanecekUtils } from './utils';

/**
 * Main client class for interacting with the Janecek Voting program
 */
export class JanecekVotingClient {
  private connection: Connection;
  private programId: PublicKey;
  private wallet: Keypair;

  constructor(config: VotingClientConfig) {
    this.connection = config.connection;
    this.programId = config.programId;
    this.wallet = config.wallet;
  }

  /**
   * Create a new poll
   */
  async createPoll(
    title: string,
    description: string
  ): Promise<{ pollPda: PublicKey; signature: string }> {
    const [pollPda] = JanecekUtils.derivePollPda(this.programId, title, description);
    
    const instruction = JanecekInstructions.createPoll(
      this.programId,
      pollPda,
      this.wallet.publicKey,
      title,
      description
    );

    const transaction = new Transaction().add(instruction);
    
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet]
    );

    return { pollPda, signature };
  }

  /**
   * Create a new party for a poll
   */
  async createParty(
    pollPda: PublicKey,
    partyTitle: string
  ): Promise<{ partyPda: PublicKey; signature: string }> {
    const [partyPda] = JanecekUtils.derivePartyPda(this.programId, pollPda, partyTitle);
    
    const instruction = JanecekInstructions.createParty(
      this.programId,
      pollPda,
      partyPda,
      this.wallet.publicKey,
      partyTitle
    );

    const transaction = new Transaction().add(instruction);
    
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet]
    );

    return { partyPda, signature };
  }

  /**
   * Initiate owner transfer
   */
  async initiateOwnerTransfer(
    pollPda: PublicKey,
    newOwner: PublicKey
  ): Promise<string> {
    const instruction = JanecekInstructions.initiateOwnerTransfer(
      this.programId,
      pollPda,
      this.wallet.publicKey,
      newOwner
    );

    const transaction = new Transaction().add(instruction);
    
    return await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet]
    );
  }

  /**
   * Accept owner transfer
   */
  async acceptOwnerTransfer(pollPda: PublicKey): Promise<string> {
    const instruction = JanecekInstructions.acceptOwnerTransfer(
      this.programId,
      pollPda,
      this.wallet.publicKey
    );

    const transaction = new Transaction().add(instruction);
    
    return await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet]
    );
  }

  /**
   * Start voting phase
   */
  async startVoting(pollPda: PublicKey): Promise<string> {
    const instruction = JanecekInstructions.startVoting(
      this.programId,
      pollPda,
      this.wallet.publicKey
    );

    const transaction = new Transaction().add(instruction);
    
    return await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet]
    );
  }

  /**
   * Cast a vote
   */
  async vote(
    pollPda: PublicKey,
    partyPda: PublicKey,
    voteType: VoteType
  ): Promise<string> {
    const [voterPda] = JanecekUtils.deriveVoterPda(
      this.programId,
      pollPda,
      this.wallet.publicKey
    );
    
    const instruction = JanecekInstructions.vote(
      this.programId,
      pollPda,
      partyPda,
      voterPda,
      this.wallet.publicKey,
      voteType
    );

    const transaction = new Transaction().add(instruction);
    
    return await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet]
    );
  }

  /**
   * End voting phase
   */
  async endVoting(pollPda: PublicKey): Promise<string> {
    const instruction = JanecekInstructions.endVoting(
      this.programId,
      pollPda,
      this.wallet.publicKey
    );

    const transaction = new Transaction().add(instruction);
    
    return await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet]
    );
  }

  /**
   * Get poll state
   */
  async getPollState(pollPda: PublicKey): Promise<PollState | null> {
    return await JanecekUtils.getAccountData(
      this.connection,
      pollPda,
      JanecekUtils.deserializePollState
    );
  }

  /**
   * Get party account data
   */
  async getPartyAccount(partyPda: PublicKey): Promise<PartyAccount | null> {
    return await JanecekUtils.getAccountData(
      this.connection,
      partyPda,
      JanecekUtils.deserializePartyAccount
    );
  }

  /**
   * Get voter account data
   */
  async getVoterAccount(pollPda: PublicKey, voterPubkey: PublicKey): Promise<VoterAccount | null> {
    const [voterPda] = JanecekUtils.deriveVoterPda(this.programId, pollPda, voterPubkey);
    
    return await JanecekUtils.getAccountData(
      this.connection,
      voterPda,
      JanecekUtils.deserializeVoterAccount
    );
  }

  /**
   * Get all parties for a poll
   */
  async getPollParties(pollPda: PublicKey): Promise<PartyAccount[]> {
    const pollState = await this.getPollState(pollPda);
    if (!pollState) return [];

    const parties: PartyAccount[] = [];
    for (const partyPda of pollState.parties) {
      const party = await this.getPartyAccount(partyPda);
      if (party) parties.push(party);
    }

    return parties;
  }

  /**
   * Check if voting is active
   */
  async isVotingActive(pollPda: PublicKey): Promise<boolean> {
    const pollState = await this.getPollState(pollPda);
    if (!pollState) return false;

    return pollState.phase === VotingPhase.Voting;
  }

  /**
   * Check if registration is active
   */
  async isRegistrationActive(pollPda: PublicKey): Promise<boolean> {
    const pollState = await this.getPollState(pollPda);
    if (!pollState) return false;

    return pollState.phase === VotingPhase.Registration;
  }

  /**
   * Get voting results
   */
  async getVotingResults(pollPda: PublicKey): Promise<{ party: string; positiveVotes: number; negativeVotes: number }[]> {
    const parties = await this.getPollParties(pollPda);
    
    return parties.map(party => ({
      party: party.title,
      positiveVotes: party.positiveVotes,
      negativeVotes: party.negativeVotes,
    }));
  }

  /**
   * Fund account with SOL (useful for testing)
   */
  async fundAccount(pubkey: PublicKey, amount: number = 1): Promise<string> {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.wallet.publicKey,
        toPubkey: pubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    return await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet]
    );
  }

  /**
   * Get account balance
   */
  async getBalance(pubkey: PublicKey): Promise<number> {
    const balance = await this.connection.getBalance(pubkey);
    return balance / LAMPORTS_PER_SOL;
  }
}

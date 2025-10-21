import { 
  Connection, 
  Keypair, 
  PublicKey, 
  clusterApiUrl,
} from '@solana/web3.js';
import { getPollState } from '../services/pollService'
import { createPoll } from '../services/pollTransaction';
import { VotingPhase } from '../types/VotingPhase';
import { deserializePollState } from '../utils/deserialize';
import { createAccountDeserializer } from '../services/accountService';

describe('Janecek Voting Tests', () => {
  let connection: Connection;
  let pollOwner: Keypair;
  let voter1: Keypair;
  let voter2: Keypair;
  let programId: PublicKey;
  let pollPda: PublicKey;
  let partyAPda: PublicKey;
  let partyBPda: PublicKey;
  let randomSeed: String;


  beforeAll(async () => {
    connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // keypairs
    // Example: Load from secret key Uint8Array (replace with your actual 64-byte secret keys)
    const pollOwnerSecretKey = Uint8Array.from([
        247,36,106,22,39,76,62,197,230,8,113,75,154,95,37,51,187,186,216,176,173,0,249,185,32,110,230,135,130,12,184,16,107,234,23,232,41,105,199,57,189,47,183,97,40,128,235,80,77,50,33,220,150,222,190,179,180,181,70,156,104,131,239,72
    ]);
    const voter1SecretKey = Uint8Array.from([
        10,138,138,97,132,127,91,200,110,1,95,148,206,157,13,170,95,62,187,244,45,184,9,8,212,131,114,83,77,6,30,32,229,28,194,232,97,180,125,39,233,77,253,19,206,199,94,67,12,91,49,225,197,116,157,108,23,153,140,196,243,217,142,220
    ]);
    const voter2SecretKey = Uint8Array.from([
        74,200,229,217,245,28,42,83,171,209,146,172,226,191,14,196,32,115,53,123,33,136,66,35,77,134,42,223,87,129,250,127,235,50,47,68,165,138,3,241,197,115,34,78,64,243,233,128,78,178,107,9,62,63,184,122,49,58,119,202,84,180,142,55
    ]);
    pollOwner = Keypair.fromSecretKey(pollOwnerSecretKey);
    voter1 = Keypair.fromSecretKey(voter1SecretKey);
    voter2 = Keypair.fromSecretKey(voter2SecretKey);
    
    // program ID
    programId = new PublicKey('6LKL9MnuNGd3fpEp5U3P9Sm8LW5YuHasKRp8Jwyp9Hhy');

    randomSeed = Keypair.generate().publicKey.toString()

    // Fund accounts (you'll need to fund these manually or use airdrop)
    console.log('Poll Owner:', pollOwner.publicKey.toString());
    console.log('Poll Owner Balance:', await connection.getBalance(pollOwner.publicKey));
    console.log('Voter 1:', voter1.publicKey.toString());
    console.log('Voter 1 Balance:', await connection.getBalance(voter1.publicKey));
    console.log('Voter 2:', voter2.publicKey.toString());
    console.log('Voter 2 Balance:', await connection.getBalance(voter2.publicKey));
  });

  describe('Poll Creation and Management', () => {

    test('should create a poll successfully', async () => {

      const { pollPda: createdPollPda, signature } = await createPoll(
        connection,
        pollOwner,
        'Integration Test Poll ' + randomSeed,
        'Testing the complete voting system functionality'
      ); 
      await connection.confirmTransaction(signature, "confirmed");

      
      pollPda = createdPollPda;
      expect(pollPda).toBeInstanceOf(PublicKey);
      expect(signature).toBeDefined();
      
      console.log('Poll created:', pollPda.toString());
      console.log('Transaction signature:', signature);
    });

    test('should retrieve poll state after creation', async () => {
      const deserializer = createAccountDeserializer(connection);
      const pollState = await deserializer.getPollState(pollPda);
      
      expect(pollState).toBeDefined();
      expect(pollState!.title).toBe('Integration Test Poll ' + randomSeed);
      expect(pollState!.description).toBe('Testing the complete voting system functionality');
      expect(pollState!.getVotingPhase()).toBe(VotingPhase.Registration);
      expect(pollState!.getOwnerPubkey().toString()).toBe(pollOwner.publicKey.toString());
      expect(pollState!.parties).toHaveLength(0);
    });

    // test('should create parties successfully', async () => {
    //   const { partyPda: createdPartyAPda, signature: signatureA } = await pollOwnerClient.createParty(
    //     pollPda,
    //     'Democratic Party'
    //   );
      
    //   const { partyPda: createdPartyBPda, signature: signatureB } = await pollOwnerClient.createParty(
    //     pollPda,
    //     'Republican Party'
    //   );
      
    //   partyAPda = createdPartyAPda;
    //   partyBPda = createdPartyBPda;
      
    //   expect(partyAPda).toBeInstanceOf(PublicKey);
    //   expect(partyBPda).toBeInstanceOf(PublicKey);
    //   expect(signatureA).toBeDefined();
    //   expect(signatureB).toBeDefined();
      
    //   console.log('Party A created:', partyAPda.toString());
    //   console.log('Party B created:', partyBPda.toString());
    // });

    // test('should retrieve party accounts', async () => {
    //   const partyA = await pollOwnerClient.getPartyAccount(partyAPda);
    //   const partyB = await pollOwnerClient.getPartyAccount(partyBPda);
      
    //   expect(partyA).toBeDefined();
    //   expect(partyA!.title).toBe('Democratic Party');
    //   expect(partyA!.positiveVotes).toBe(0);
    //   expect(partyA!.negativeVotes).toBe(0);
      
    //   expect(partyB).toBeDefined();
    //   expect(partyB!.title).toBe('Republican Party');
    //   expect(partyB!.positiveVotes).toBe(0);
    //   expect(partyB!.negativeVotes).toBe(0);
    // });

    // test('should get all parties for the poll', async () => {
    //   const parties = await pollOwnerClient.getPollParties(pollPda);
      
    //   expect(parties).toHaveLength(2);
    //   expect(parties.some(p => p.title === 'Democratic Party')).toBe(true);
    //   expect(parties.some(p => p.title === 'Republican Party')).toBe(true);
    // });
  });

//   describe('Voting Phase Management', () => {
//     test('should start voting phase', async () => {
//       const signature = await pollOwnerClient.startVoting(pollPda);
      
//       expect(signature).toBeDefined();
//       console.log('Voting started. Transaction signature:', signature);
      
//       // Wait for transaction confirmation
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     });

//     test('should verify voting phase is active', async () => {
//       const isVotingActive = await pollOwnerClient.isVotingActive(pollPda);
//       const isRegistrationActive = await pollOwnerClient.isRegistrationActive(pollPda);
      
//       expect(isVotingActive).toBe(true);
//       expect(isRegistrationActive).toBe(false);
//     });

//     test('should retrieve updated poll state', async () => {
//       const pollState = await pollOwnerClient.getPollState(pollPda);
      
//       expect(pollState).toBeDefined();
//       expect(pollState!.phase).toBe(VotingPhase.Voting);
//       expect(pollState!.votingStartAt).toBeGreaterThan(0);
//     });
//   });

//   describe('Voting Functionality', () => {
//     test('should allow voter1 to cast positive votes', async () => {
//       // Vote positive for Party A (first vote)
//       const signature1 = await voter1Client.vote(pollPda, partyAPda, VoteType.Positive);
//       expect(signature1).toBeDefined();
//       console.log('Voter1 positive vote 1:', signature1);
      
//       // Wait for transaction confirmation
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Vote positive for Party A (second vote)
//       const signature2 = await voter1Client.vote(pollPda, partyAPda, VoteType.Positive);
//       expect(signature2).toBeDefined();
//       console.log('Voter1 positive vote 2:', signature2);
      
//       // Wait for transaction confirmation
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     });

//     test('should allow voter1 to cast negative vote', async () => {
//       // Vote negative for Party B (requires 2 positive votes first)
//       const signature = await voter1Client.vote(pollPda, partyBPda, VoteType.Negative);
//       expect(signature).toBeDefined();
//       console.log('Voter1 negative vote:', signature);
      
//       // Wait for transaction confirmation
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     });

//     test('should allow voter2 to cast votes', async () => {
//       // Voter2 votes positive for Party B twice
//       const signature1 = await voter2Client.vote(pollPda, partyBPda, VoteType.Positive);
//       expect(signature1).toBeDefined();
//       console.log('Voter2 positive vote 1:', signature1);
      
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       const signature2 = await voter2Client.vote(pollPda, partyBPda, VoteType.Positive);
//       expect(signature2).toBeDefined();
//       console.log('Voter2 positive vote 2:', signature2);
      
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Voter2 votes negative for Party A
//       const signature3 = await voter2Client.vote(pollPda, partyAPda, VoteType.Negative);
//       expect(signature3).toBeDefined();
//       console.log('Voter2 negative vote:', signature3);
      
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     });

//     test('should retrieve voter account states', async () => {
//       const voter1Account = await pollOwnerClient.getVoterAccount(pollPda, voter1.publicKey);
//       const voter2Account = await pollOwnerClient.getVoterAccount(pollPda, voter2.publicKey);
      
//       expect(voter1Account).toBeDefined();
//       expect(voter1Account!.positiveUsed).toBe(2);
//       expect(voter1Account!.negativeUsed).toBe(1);
//       expect(voter1Account!.votedParties).toHaveLength(2);
      
//       expect(voter2Account).toBeDefined();
//       expect(voter2Account!.positiveUsed).toBe(2);
//       expect(voter2Account!.negativeUsed).toBe(1);
//       expect(voter2Account!.votedParties).toHaveLength(2);
//     });
//   });

//   describe('Results and Statistics', () => {
//     test('should get voting results', async () => {
//       const results = await pollOwnerClient.getVotingResults(pollPda);
      
//       expect(results).toHaveLength(2);
      
//       const partyA = results.find(r => r.party === 'Democratic Party');
//       const partyB = results.find(r => r.party === 'Republican Party');
      
//       expect(partyA).toBeDefined();
//       expect(partyB).toBeDefined();
      
//       // Voter1: +2 for Party A, -1 for Party B
//       // Voter2: +2 for Party B, -1 for Party A
//       expect(partyA!.positiveVotes).toBe(2);
//       expect(partyA!.negativeVotes).toBe(1);
//       expect(partyB!.positiveVotes).toBe(2);
//       expect(partyB!.negativeVotes).toBe(1);
      
//       console.log('Final Results:', results);
//     });

//     test('should retrieve updated party accounts', async () => {
//       const partyA = await pollOwnerClient.getPartyAccount(partyAPda);
//       const partyB = await pollOwnerClient.getPartyAccount(partyBPda);
      
//       expect(partyA!.positiveVotes).toBe(2);
//       expect(partyA!.negativeVotes).toBe(1);
//       expect(partyB!.positiveVotes).toBe(2);
//       expect(partyB!.negativeVotes).toBe(1);
//     });
//   });

//   describe('Error Handling', () => {
//     test('should prevent double voting for the same party', async () => {
//       await expect(
//         voter1Client.vote(pollPda, partyAPda, VoteType.Positive)
//       ).rejects.toThrow();
//     });

//     test('should prevent negative vote without using all positive votes', async () => {
//       const newVoter = Keypair.generate();
//       const newVoterClient = new JanecekVotingClient({
//         connection,
//         programId,
//         wallet: newVoter,
//       });

//       // Try to vote negative without positive votes first
//       await expect(
//         newVoterClient.vote(pollPda, partyAPda, VoteType.Negative)
//       ).rejects.toThrow();
//     });

//     test('should prevent voting during registration phase', async () => {
//       // Create a new poll
//       const { pollPda: newPollPda } = await pollOwnerClient.createPoll(
//         'Error Test Poll',
//         'Testing error conditions'
//       );

//       // Try to vote before starting voting phase
//       await expect(
//         voter1Client.vote(newPollPda, partyAPda, VoteType.Positive)
//       ).rejects.toThrow();
//     });
//   });

//   describe('Owner Transfer', () => {
//     test('should initiate owner transfer', async () => {
//       const signature = await pollOwnerClient.initiateOwnerTransfer(
//         pollPda,
//         voter1.publicKey
//       );
      
//       expect(signature).toBeDefined();
//       console.log('Owner transfer initiated:', signature);
      
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     });

//     test('should accept owner transfer', async () => {
//       const signature = await voter1Client.acceptOwnerTransfer(pollPda);
      
//       expect(signature).toBeDefined();
//       console.log('Owner transfer accepted:', signature);
      
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     });

//     test('should verify ownership transfer', async () => {
//       const pollState = await pollOwnerClient.getPollState(pollPda);
      
//       expect(pollState).toBeDefined();
//       expect(pollState!.owner.toString()).toBe(voter1.publicKey.toString());
//     });
//   });

//   afterAll(async () => {
//     console.log('Integration tests completed');
//     console.log('Poll PDA:', pollPda.toString());
//     console.log('Party A PDA:', partyAPda.toString());
//     console.log('Party B PDA:', partyBPda.toString());
//   });
});

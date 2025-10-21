# Janecek Voting Client

A comprehensive TypeScript client for the Janecek Voting Solana program. This client provides a complete interface for creating polls, managing parties, handling voting, and transferring ownership.

## Features

- 🗳️ **Complete Voting System**: Create polls, add parties, manage voting phases
- 🔐 **Owner Management**: Transfer poll ownership with secure handoff
- 📊 **Real-time Results**: Get voting results and poll statistics
- 🛡️ **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🧪 **Testing**: Jest test suite with unit and integration tests
- 📚 **Examples**: Multiple example implementations for different use cases

## Installation

```bash
npm install
```

## Quick Setup

Run the setup script to install dependencies, build the project, and run tests:

```bash
./setup.sh
```

## Usage

### Basic Setup

```typescript
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  clusterApiUrl 
} from '@solana/web3.js';
import { JanecekVotingClient, VoteType } from './dist';

// Setup connection and wallet
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const wallet = Keypair.generate(); // or load from file
const programId = new PublicKey('YOUR_PROGRAM_ID_HERE');

// Create client
const client = new JanecekVotingClient({
  connection,
  programId,
  wallet,
});
```

### Creating a Poll

```typescript
const { pollPda, signature } = await client.createPoll(
  'Election 2024',
  'Presidential election for 2024'
);
console.log('Poll created:', pollPda.toString());
```

### Adding Parties

```typescript
const { partyPda } = await client.createParty(pollPda, 'Democratic Party');
const { partyPda: partyBPda } = await client.createParty(pollPda, 'Republican Party');
```

### Starting Voting

```typescript
await client.startVoting(pollPda);
```

### Casting Votes

```typescript
// Vote positive for a party (up to 2 positive votes per voter)
await client.vote(pollPda, partyPda, VoteType.Positive);

// Vote negative for a party (1 negative vote per voter, requires 2 positive votes first)
await client.vote(pollPda, partyPda, VoteType.Negative);
```

### Getting Results

```typescript
const results = await client.getVotingResults(pollPda);
console.log('Voting results:', results);
// Output: [{ party: 'Democratic Party', positiveVotes: 5, negativeVotes: 2 }, ...]
```

### Owner Transfer

```typescript
// Current owner initiates transfer
await client.initiateOwnerTransfer(pollPda, newOwnerPublicKey);

// New owner accepts transfer
const newOwnerClient = new JanecekVotingClient({
  connection,
  programId,
  wallet: newOwnerKeypair,
});
await newOwnerClient.acceptOwnerTransfer(pollPda);
```

## API Reference

### JanecekVotingClient

#### Constructor
```typescript
new JanecekVotingClient(config: VotingClientConfig)
```

#### Methods

- `createPoll(title: string, description: string)` - Create a new poll
- `createParty(pollPda: PublicKey, partyTitle: string)` - Add a party to a poll
- `initiateOwnerTransfer(pollPda: PublicKey, newOwner: PublicKey)` - Initiate ownership transfer
- `acceptOwnerTransfer(pollPda: PublicKey)` - Accept ownership transfer
- `startVoting(pollPda: PublicKey)` - Start the voting phase
- `vote(pollPda: PublicKey, partyPda: PublicKey, voteType: VoteType)` - Cast a vote
- `endVoting(pollPda: PublicKey)` - End the voting phase
- `getPollState(pollPda: PublicKey)` - Get poll information
- `getPartyAccount(partyPda: PublicKey)` - Get party information
- `getVoterAccount(pollPda: PublicKey, voterPubkey: PublicKey)` - Get voter information
- `getPollParties(pollPda: PublicKey)` - Get all parties for a poll
- `isVotingActive(pollPda: PublicKey)` - Check if voting is active
- `isRegistrationActive(pollPda: PublicKey)` - Check if registration is active
- `getVotingResults(pollPda: PublicKey)` - Get voting results

### Types

- `VotingPhase` - Registration, Voting, Results
- `VoteType` - Positive, Negative
- `PollState` - Poll account data structure
- `PartyAccount` - Party account data structure
- `VoterAccount` - Voter account data structure

## Examples

The `examples/` directory contains comprehensive examples:

- `basic-usage.ts` - Basic poll creation and voting
- `owner-transfer.ts` - Owner transfer functionality
- `voting-scenarios.ts` - Multiple voters and complex scenarios

Run examples:
```bash
npm run build
node dist/examples/basic-usage.js
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test -- --coverage
```

## Building

Build the project:
```bash
npm run build
```

Watch mode for development:
```bash
npm run dev
```

## Configuration

Copy `config.template.ts` to `config.ts` and update with your values:

```typescript
export const CONFIG = {
  network: 'devnet',
  programId: new PublicKey('YOUR_PROGRAM_ID_HERE'),
  // ... other configuration
};
```

## Voting Rules

The Janecek voting system implements a unique voting mechanism:

1. **Registration Phase**: Poll owner creates poll and adds parties
2. **Voting Phase**: Voters can cast votes (minimum 24-hour registration period)
3. **Vote Types**:
   - **Positive Votes**: Up to 2 per voter, can be distributed across parties
   - **Negative Votes**: 1 per voter, requires using all 2 positive votes first
4. **Voting Period**: Maximum 7 days from poll creation
5. **Results Phase**: Voting ends automatically after 7 days

## Error Handling

The client includes comprehensive error handling for common scenarios:

- `RegistrationPhaseTooShort` - Registration period must be at least 24 hours
- `VotingPeriodFinished` - Voting period has ended
- `NoPositiveVoice` - Voter has no positive votes remaining
- `NoNegativeVoice` - Voter has no negative votes remaining
- `AlreadyVoted` - Voter already voted for this party
- `MustUseAllPositiveVoices` - Must use all positive votes before negative

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details
# Janecek Voting Client - Project Structure

This TypeScript client provides a complete interface for interacting with the Janecek Voting Solana program.

## Project Structure

```
client/
├── src/
│   ├── types.ts              # TypeScript type definitions matching Rust structures
│   ├── instructions.ts       # Instruction builders for all program operations
│   ├── utils.ts             # Utility functions for PDA derivation and account management
│   ├── client.ts            # Main client class with all program interactions
│   ├── index.ts             # Main export file
│   └── __tests__/
│       └── client.test.ts    # Jest test suite
├── examples/
│   ├── basic-usage.ts       # Basic poll creation and voting example
│   ├── owner-transfer.ts    # Owner transfer functionality example
│   └── voting-scenarios.ts  # Multiple voters and complex scenarios
├── package.json             # Node.js dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── jest.config.js          # Jest testing configuration
├── setup.sh               # Automated setup script
├── config.template.ts     # Configuration template
├── README.md             # Comprehensive documentation
└── .gitignore            # Git ignore rules
```

## Key Features Implemented

### 1. Complete Type System
- `VotingPhase` enum (Registration, Voting, Results)
- `VoteType` enum (Positive, Negative)
- `PollState`, `PartyAccount`, `VoterAccount` interfaces
- `JanecekError` enum for error handling
- `InstructionDiscriminator` enum for instruction types

### 2. Instruction Builders (`instructions.ts`)
- `createPoll()` - Create new poll with title and description
- `createParty()` - Add party to existing poll
- `initiateOwnerTransfer()` - Initiate ownership transfer
- `acceptOwnerTransfer()` - Accept ownership transfer
- `startVoting()` - Start voting phase
- `vote()` - Cast positive or negative vote
- `endVoting()` - End voting phase

### 3. Utility Functions (`utils.ts`)
- PDA derivation for polls, parties, and voters
- Account size calculations
- Data serialization/deserialization
- Account state checking
- Hash functions (simplified implementation)

### 4. Main Client Class (`client.ts`)
- Complete API for all program operations
- Transaction building and sending
- Account data retrieval
- Voting result aggregation
- Error handling and validation

### 5. Comprehensive Examples
- **Basic Usage**: Simple poll creation and voting
- **Owner Transfer**: Demonstrates ownership transfer workflow
- **Voting Scenarios**: Multiple voters with complex voting patterns

### 6. Testing Suite
- Unit tests for utility functions
- Type validation tests
- Client method availability tests
- PDA derivation tests

## Usage Workflow

1. **Setup**: Install dependencies and configure program ID
2. **Create Poll**: Initialize poll with title and description
3. **Add Parties**: Create parties that voters can vote for
4. **Start Voting**: Transition from registration to voting phase
5. **Cast Votes**: Voters cast positive (up to 2) and negative (1) votes
6. **Get Results**: Retrieve voting results and statistics
7. **Transfer Ownership**: Optional ownership transfer functionality

## Voting System Rules

- **Registration Phase**: Poll owner creates poll and adds parties
- **Voting Phase**: Voters cast votes (minimum 24-hour registration period)
- **Positive Votes**: Up to 2 per voter, can be distributed across parties
- **Negative Votes**: 1 per voter, requires using all 2 positive votes first
- **Voting Period**: Maximum 7 days from poll creation
- **Results Phase**: Automatic transition after voting period ends

## Dependencies

- `@solana/web3.js` - Solana blockchain interaction
- `@solana/spl-token` - SPL token support
- `borsh` - Data serialization/deserialization
- `typescript` - TypeScript support
- `jest` - Testing framework

## Getting Started

1. Run `./setup.sh` for automated setup
2. Update program ID in examples and tests
3. Deploy your Solana program
4. Fund wallet with SOL for testing
5. Run examples: `npm run build && node dist/examples/basic-usage.js`

This client provides a production-ready interface for the Janecek Voting system with comprehensive error handling, type safety, and extensive documentation.

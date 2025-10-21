# Integration Tests for Janecek Voting Client

This directory contains comprehensive integration tests that test the actual functionality of the Janecek Voting Solana program.

## Prerequisites

1. **Deployed Program**: Your Janecek Voting program must be deployed to Solana devnet
2. **Funded Accounts**: Test accounts need SOL for transaction fees
3. **Program ID**: Update the program ID in the test files

## Test Structure

### `integration.test.ts`
Comprehensive integration tests covering:

- **Poll Creation**: Creating polls with title and description
- **Party Management**: Adding parties to polls
- **Voting Phase**: Starting and managing voting phases
- **Voting Functionality**: Casting positive and negative votes
- **Results**: Retrieving voting results and statistics
- **Error Handling**: Testing error conditions and edge cases
- **Owner Transfer**: Testing ownership transfer functionality

### Test Scenarios

1. **Complete Voting Flow**:
   - Create poll with 2 parties
   - Start voting phase
   - Multiple voters cast votes (positive and negative)
   - Verify results and account states

2. **Error Conditions**:
   - Double voting prevention
   - Invalid vote sequences
   - Phase-based restrictions

3. **Owner Transfer**:
   - Initiate transfer
   - Accept transfer
   - Verify ownership change

## Running Integration Tests

### 1. Install Dependencies
```bash
npm install
```

### 2. Update Program ID
Edit `src/__tests__/integration.test.ts` and replace:
```typescript
programId = new PublicKey('YOUR_PROGRAM_ID_HERE');
```
with your actual deployed program ID.

### 3. Fund Test Accounts
The tests will generate new keypairs and display their public keys. You need to fund these accounts:

```bash
# Run the test once to see the account addresses
npm run test:integration

# Copy the displayed public keys and fund them with SOL
# You can use Solana CLI or the funding script
```

### 4. Run Integration Tests
```bash
# Run only integration tests
npm run test:integration

# Run all tests
npm test

# Run unit tests only
npm run test:unit
```

## Test Account Funding

### Option 1: Manual Funding
1. Run the integration test once to see the generated public keys
2. Use Solana CLI to fund accounts:
```bash
solana airdrop 2 <PUBLIC_KEY> --url devnet
```

### Option 2: Automated Funding Script
1. Update `scripts/fund-accounts.ts` with the public keys from your test run
2. Run the funding script:
```bash
npm run fund-accounts
```

## Test Output

The integration tests provide detailed console output including:
- Transaction signatures
- Account addresses (PDAs)
- Voting results
- Error messages

Example output:
```
Poll created: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Party A created: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
Party B created: 5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1
Voting started. Transaction signature: 3Kx8...
Voter1 positive vote 1: 4Lx9...
Final Results: [
  { party: 'Democratic Party', positiveVotes: 2, negativeVotes: 1 },
  { party: 'Republican Party', positiveVotes: 2, negativeVotes: 1 }
]
```

## Troubleshooting

### Common Issues

1. **"Insufficient funds"**: Fund the test accounts with more SOL
2. **"Program not found"**: Verify the program ID is correct and the program is deployed
3. **"Account not found"**: The program might not be deployed or the PDA derivation is incorrect
4. **"Transaction failed"**: Check the program logs and ensure all accounts are properly funded

### Debug Mode

For detailed debugging, you can modify the test to use a local validator:
```typescript
const connection = new Connection('http://localhost:8899', 'confirmed');
```

### Test Timeout

Integration tests have a 5-minute timeout. If tests are timing out:
1. Check network connectivity
2. Ensure accounts are properly funded
3. Verify the program is deployed and accessible

## Test Data

The integration tests use the following test data:
- **Poll Title**: "Integration Test Poll"
- **Poll Description**: "Testing the complete voting system functionality"
- **Parties**: "Democratic Party", "Republican Party"
- **Voting Pattern**: 
  - Voter1: +2 votes for Party A, -1 vote for Party B
  - Voter2: +2 votes for Party B, -1 vote for Party A

## Expected Results

After running the complete integration test suite, you should see:
- Poll created successfully
- 2 parties added to the poll
- Voting phase started
- 6 total votes cast (4 positive, 2 negative)
- Both parties have 2 positive votes and 1 negative vote each
- Owner transfer completed successfully

This validates that the entire Janecek voting system is working correctly end-to-end.

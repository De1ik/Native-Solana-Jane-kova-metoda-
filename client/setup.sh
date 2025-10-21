#!/bin/bash

# Janecek Voting Client Setup Script

echo "🚀 Setting up Janecek Voting Client..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Project built successfully"
else
    echo "❌ Failed to build project"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -eq 0 ]; then
    echo "✅ Tests passed"
else
    echo "⚠️  Some tests failed (this might be expected if program ID is not set)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update the program ID in your examples and tests"
echo "2. Deploy your Solana program to devnet/mainnet"
echo "3. Fund your wallet with SOL for testing"
echo "4. Run the examples:"
echo "   - npm run build && node dist/examples/basic-usage.js"
echo "   - npm run build && node dist/examples/owner-transfer.js"
echo "   - npm run build && node dist/examples/voting-scenarios.js"
echo ""
echo "📚 Documentation:"
echo "- Check README.md for usage instructions"
echo "- Examples are in the examples/ directory"
echo "- Tests are in src/__tests__/"

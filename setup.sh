#!/bin/bash

# Space Shooter Game - Quick Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 Space Shooter Game - Setup Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} found${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm ${NPM_VERSION} found${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Space Shooter Game - Environment Variables
# Add any environment-specific configuration here

# Example:
# API_URL=https://api.example.com
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
fi
echo ""

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Space Shooter Game"
    echo -e "${GREEN}✅ Git repository initialized${NC}"
    echo ""
    echo -e "${YELLOW}💡 Next steps:${NC}"
    echo "   1. Create a repository on GitHub"
    echo "   2. Run: git remote add origin <your-repo-url>"
    echo "   3. Run: git push -u origin main"
else
    echo -e "${GREEN}✅ Git repository already initialized${NC}"
fi
echo ""

# Display next steps
echo "🎉 Setup complete!"
echo ""
echo "═══════════════════════════════════════"
echo "  NEXT STEPS"
echo "═══════════════════════════════════════"
echo ""
echo "1️⃣  Start development server:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "2️⃣  Build for production:"
echo "   ${GREEN}npm run build${NC}"
echo ""
echo "3️⃣  Deploy to GitHub Pages:"
echo "   ${GREEN}npm run deploy${NC}"
echo ""
echo "═══════════════════════════════════════"
echo ""
echo "📚 Documentation:"
echo "   - README.md         - Project overview"
echo "   - QUICKSTART.md     - Quick start guide"
echo "   - DEPLOYMENT.md     - Deployment guide"
echo "   - CONTRIBUTING.md   - How to contribute"
echo ""
echo "🎮 Game controls:"
echo "   - Move: Arrow Keys / WASD"
echo "   - Shoot: SPACE"
echo "   - Pause: ESC / P"
echo ""
echo "Happy coding! 🚀✨"

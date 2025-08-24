#!/bin/bash

# Automated deployment script for Vercel
# This script prepares the project for deployment

echo "🚀 Preparing project for Vercel deployment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

# Clean Next.js cache
echo "🧹 Cleaning cache..."
rm -rf .next

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Verify the build works
echo "🔨 Verifying production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check that all environment variables are documented
    echo "📋 Checking environment variables..."
    if [ ! -f ".env.example" ]; then
        echo "⚠️  Warning: .env.example not found"
    else
        echo "✅ .env.example found"
    fi
    
    echo ""
    echo "🎉 Project ready for deployment!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Make sure your code is on GitHub"
    echo "2. Go to https://vercel.com and import your repository"
    echo "3. Configure environment variables in Vercel"
    echo "4. Deploy!"
    echo ""
    echo "📖 For more details, check DEPLOYMENT.md"
    
else
    echo "❌ Build error. Check the errors above."
    exit 1
fi

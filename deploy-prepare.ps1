# Automated deployment script for Vercel (Windows PowerShell)
# This script prepares the project for deployment

Write-Host "🚀 Preparing project for Vercel deployment..." -ForegroundColor Green

# Check if we're in the correct directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Run this script from the project root." -ForegroundColor Red
    exit 1
}

# Clean Next.js cache
Write-Host "🧹 Cleaning cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

# Verify the build works
Write-Host "🔨 Verifying production build..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Check that all environment variables are documented
    Write-Host "📋 Checking environment variables..." -ForegroundColor Blue
    if (!(Test-Path ".env.example")) {
        Write-Host "⚠️  Warning: .env.example not found" -ForegroundColor Yellow
    } else {
        Write-Host "✅ .env.example found" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🎉 Project ready for deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Make sure your code is on GitHub" -ForegroundColor White
    Write-Host "2. Go to https://vercel.com and import your repository" -ForegroundColor White
    Write-Host "3. Configure environment variables in Vercel" -ForegroundColor White
    Write-Host "4. Deploy!" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 For more details, check DEPLOYMENT.md" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ Build error. Check the errors above." -ForegroundColor Red
    exit 1
}

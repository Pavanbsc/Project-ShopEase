# ShopEase Product Backend Startup Script
# This script starts the Node.js backend server on port 8083

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Starting ShopEase Product API" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
$backendPath = "$PSScriptRoot\node-backend"
Write-Host "Backend path: $backendPath" -ForegroundColor Yellow

# Check if node_modules exists
if (-not (Test-Path "$backendPath\node_modules")) {
    Write-Host "ERROR: node_modules not found!" -ForegroundColor Red
    Write-Host "Please run: npm install in the node-backend directory" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path "$backendPath\.env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host ".env file verified" -ForegroundColor Green
Write-Host "node_modules verified" -ForegroundColor Green
Write-Host ""

# Change to backend directory and start
Set-Location $backendPath
Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host ""

# Start the backend
npm run start

Write-Host ""
Write-Host "If you see 'ShopEase product API listening on port 8083' above, the backend is running!" -ForegroundColor Green
Write-Host "You can now use the Add Product feature from the admin panel." -ForegroundColor Green
Write-Host ""

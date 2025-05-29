# Test script for local build of Matrix Social Links project
Write-Host "Testing local build of Matrix Social Links project..." -ForegroundColor Green

# Check if dist directory exists
if (-not (Test-Path ".\dist")) {
    Write-Host "Error: dist directory not found. Please run build.ps1 first." -ForegroundColor Red
    exit 1
}

# Check if index.html exists in dist directory
if (-not (Test-Path ".\dist\index.html")) {
    Write-Host "Error: index.html not found in dist directory. Please run build.ps1 first." -ForegroundColor Red
    exit 1
}

# Open the test-local.html file in the default browser
Write-Host "Opening test-local.html in the default browser..." -ForegroundColor Cyan
Start-Process ".\test-local.html"

Write-Host "Test started successfully!" -ForegroundColor Green
Write-Host "If the application doesn't display correctly, please check the browser console for errors." -ForegroundColor Yellow 
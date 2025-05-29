# Development server script for Matrix Social Links project
Write-Host "Starting development server for Matrix Social Links project..." -ForegroundColor Green

# Set path to Node.js executable
$nodePath = ".\node-v20.12.2-win-x64\node.exe"

# Check if Node.js executable exists
if (-not (Test-Path $nodePath)) {
    Write-Host "Error: Node.js executable not found at $nodePath" -ForegroundColor Red
    exit 1
}

# Run Vite development server
Write-Host "Starting Vite development server..." -ForegroundColor Cyan
& $nodePath .\node_modules\vite\bin\vite.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to start development server" -ForegroundColor Red
    exit 1
} 
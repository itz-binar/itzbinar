# Build script for Matrix Social Links project
Write-Host "Building Matrix Social Links project..." -ForegroundColor Green

# Set path to Node.js executable
$nodePath = ".\node-v22.16.0-win-x64\node.exe"

# Check if Node.js executable exists
if (-not (Test-Path $nodePath)) {
    Write-Host "Error: Node.js executable not found at $nodePath" -ForegroundColor Red
    exit 1
}

# Run TypeScript compiler
Write-Host "Running TypeScript compiler..." -ForegroundColor Cyan
& $nodePath .\node_modules\typescript\bin\tsc
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: TypeScript compilation failed" -ForegroundColor Red
    exit 1
}

# Run Vite build
Write-Host "Running Vite build..." -ForegroundColor Cyan
& $nodePath .\node_modules\vite\bin\vite.js build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Vite build failed" -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "The build files are available in the 'dist' directory." -ForegroundColor Yellow 
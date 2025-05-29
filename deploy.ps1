# Deployment script for Matrix Social Links project
Write-Host "Deploying Matrix Social Links project to Netlify..." -ForegroundColor Green

# Set path to Node.js executable
$nodePath = ".\node-v20.12.2-win-x64\node.exe"

# Check if Node.js executable exists
if (-not (Test-Path $nodePath)) {
    Write-Host "Error: Node.js executable not found at $nodePath" -ForegroundColor Red
    exit 1
}

# Build the project first
Write-Host "Building project before deployment..." -ForegroundColor Cyan
& $nodePath .\node_modules\typescript\bin\tsc
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: TypeScript compilation failed" -ForegroundColor Red
    exit 1
}

& $nodePath .\node_modules\vite\bin\vite.js build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Vite build failed" -ForegroundColor Red
    exit 1
}

# Run the deployment script
Write-Host "Running Netlify deployment script..." -ForegroundColor Cyan
& $nodePath generate-netlify-url.cjs
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Netlify deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "Deployment completed successfully!" -ForegroundColor Green 
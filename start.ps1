# Start Script for Mateshwari Exports
Write-Host "Starting Mateshwari Exports Project..." -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
$backendPath = Join-Path $scriptPath "server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$backendPath`"; npm run dev" -WindowStyle Normal

# Wait a moment
Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
$frontendPath = Join-Path $scriptPath "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$frontendPath`"; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Check the terminal windows for startup messages and any errors." -ForegroundColor Gray

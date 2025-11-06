# PowerShell script to create .env files

Write-Host "Creating environment files..." -ForegroundColor Green

# Backend .env
$backendEnv = @"
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mateshwari_exports
JWT_SECRET=mateshwari_exports_super_secret_jwt_key_change_in_production_2024
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
"@

$frontendEnv = @"
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
"@

# Create backend/.env
$backendEnv | Out-File -FilePath "backend\.env" -Encoding utf8 -NoNewline
Write-Host "✓ Created backend/.env" -ForegroundColor Green

# Create frontend/.env
$frontendEnv | Out-File -FilePath "frontend\.env" -Encoding utf8 -NoNewline
Write-Host "✓ Created frontend/.env" -ForegroundColor Green

Write-Host "`nEnvironment files created successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Edit backend/.env and add your MySQL password (if any)" -ForegroundColor White
Write-Host "2. Set up MySQL database (see SETUP.md)" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White


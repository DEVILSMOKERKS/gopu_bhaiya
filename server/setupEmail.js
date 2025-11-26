const fs = require('fs');
const path = require('path');

console.log('📧 Email Setup Helper for Saanz Admin');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found existing .env file');
} else {
  console.log('⚠️ No .env file found. Creating one...');
}

// Check if email configuration exists
if (envContent.includes('EMAIL_USER') && envContent.includes('EMAIL_PASSWORD')) {
  console.log('✅ Email configuration already exists in .env file');
  console.log('📧 Current email settings:');
  
  const emailUserMatch = envContent.match(/EMAIL_USER=(.+)/);
  const emailPassMatch = envContent.match(/EMAIL_PASSWORD=(.+)/);
  
  if (emailUserMatch) {
    console.log(`   EMAIL_USER: ${emailUserMatch[1]}`);
  }
  if (emailPassMatch) {
    console.log(`   EMAIL_PASSWORD: ${emailPassMatch[1].substring(0, 4)}****`);
  }
} else {
  console.log('❌ Email configuration missing from .env file');
  console.log('\n🔧 To fix this, add these lines to your .env file:');
  console.log('   EMAIL_USER=your-gmail@gmail.com');
  console.log('   EMAIL_PASSWORD=your-app-password');
  console.log('\n📋 Gmail Setup Instructions:');
  console.log('   1. Enable 2-Factor Authentication on your Gmail');
  console.log('   2. Go to Google Account → Security');
  console.log('   3. Find "App passwords" under 2-Step Verification');
  console.log('   4. Generate new app password for "Mail"');
  console.log('   5. Use the 16-digit password in EMAIL_PASSWORD');
}

// Check if nodemailer is installed
try {
  require('nodemailer');
  console.log('\n✅ Nodemailer is installed');
} catch (error) {
  console.log('\n❌ Nodemailer is not installed');
  console.log('🔧 Run this command to install:');
  console.log('   npm install nodemailer');
}

console.log('\n🎯 Current Reset Link (from console):');
console.log('http://localhost:5173/admin/reset-password?token=6a00bfbfed55fa5216d4170288a75ae934a51728386a96589e1a1f66b2945126');

console.log('\n📝 Next Steps:');
console.log('   1. Add email configuration to .env file');
console.log('   2. Install nodemailer: npm install nodemailer');
console.log('   3. Test email: node testEmail.js');
console.log('   4. Try forgot password again');

console.log('\n💡 For now, you can use the reset link above to test the password reset functionality!');

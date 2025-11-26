const bcrypt = require('bcrypt');
const db = require('./config/db');
const { sendWelcomeEmail } = require('./utils/emailSender');

async function addAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Insert admin user
    const [result] = await db.execute(
      'INSERT INTO admins (name, email, password, is_verified) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@saanz.com', hashedPassword, true]
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@saanz.com');
    console.log('🔑 Password: admin123');
    console.log('🆔 Admin ID:', result.insertId);
    
    // Send welcome email
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin`;
    const emailResult = await sendWelcomeEmail('admin@saanz.com', 'Admin User', loginUrl);
    
    if (emailResult.success) {
      console.log('📧 Welcome email sent successfully!');
    } else {
      console.log('⚠️ Welcome email failed to send:', emailResult.error);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

addAdmin();

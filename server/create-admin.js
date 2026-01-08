const db = require('./config/db');
const { hashPassword } = require('./utils/bcryptUtil');

async function createAdmin() {
  try {
    // Get admin details from command line arguments or use defaults
    const name = process.argv[2] || 'Admin User';
    const email = process.argv[3] || 'admin@example.com';
    const password = process.argv[4] || 'admin123';

    if (!email || !password) {
      console.error('Usage: node create-admin.js [name] [email] [password]');
      console.error('Example: node create-admin.js "Admin User" admin@example.com mypassword123');
      process.exit(1);
    }

    // Check if admin already exists
    const [existing] = await db.execute(
      'SELECT id, email FROM admins WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('❌ Admin with this email already exists!');
      console.log(`   Email: ${email}`);
      console.log(`   ID: ${existing[0].id}`);
      process.exit(1);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await hashPassword(password);

    // Insert admin
    console.log('📝 Creating admin account...');
    const [result] = await db.execute(
      'INSERT INTO admins (name, email, password, is_verified) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 1]
    );

    console.log('\n✅ Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Name:', name);
    console.log('🆔 Admin ID:', result.insertId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 Access admin panel at: http://localhost:3000/admin');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('   An admin with this email already exists.');
    }
    process.exit(1);
  }
}

// Run the script
createAdmin();

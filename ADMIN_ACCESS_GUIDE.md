# How to Access Admin Panel

## Quick Access

### Step 1: Open Admin Panel URL
Navigate to: **`http://localhost:3000/admin`**

The admin panel will automatically show a login popup if you're not authenticated.

### Step 2: Login with Admin Credentials
You need admin credentials to access the panel. If you don't have an admin account yet, see "Creating Your First Admin Account" below.

## Admin Panel URLs

- **Main Admin Page**: `http://localhost:3000/admin`
- **Dashboard**: `http://localhost:3000/admin/dashboard`
- **Products**: `http://localhost:3000/admin/products`
- **Categories**: `http://localhost:3000/admin/categories`
- **Blogs**: `http://localhost:3000/admin/blogs`
- **Users**: `http://localhost:3000/admin/users`
- **Orders**: `http://localhost:3000/admin/orders`
- **Contact Queries**: `http://localhost:3000/admin/contact-queries`
- **Expert Consultations**: `http://localhost:3000/admin/expert-consultations`

## Creating Your First Admin Account

### Option 1: Using MySQL Database Directly

1. **Connect to your MySQL database**
2. **Run this SQL query** to create an admin account:

```sql
INSERT INTO admins (name, email, password, is_verified) 
VALUES (
  'Admin User', 
  'admin@example.com', 
  '$2b$10$YourHashedPasswordHere', 
  1
);
```

**Note**: You need to hash the password using bcrypt. Use this Node.js script:

```javascript
const bcrypt = require('bcrypt');

async function createAdmin() {
  const password = 'your_password_here';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed Password:', hashedPassword);
  
  // Then use this hashed password in the INSERT query above
}

createAdmin();
```

### Option 2: Using MySQL Workbench or phpMyAdmin

1. Open your database management tool
2. Select the `mateshwarimurti` database
3. Go to the `admins` table
4. Insert a new row with:
   - `name`: Your admin name
   - `email`: Your admin email
   - `password`: Hashed password (use bcrypt)
   - `is_verified`: Set to `1` (important!)
   - `created_at`: Current timestamp

### Option 3: Create Admin via Node.js Script

Create a file `create-admin.js` in the `server` folder:

```javascript
const db = require('./config/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    const name = 'Admin User';
    const email = 'admin@example.com';
    const password = 'your_password_here';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert admin
    await db.execute(
      'INSERT INTO admins (name, email, password, is_verified) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 1]
    );
    
    console.log('Admin created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
```

Then run:
```bash
cd server
node create-admin.js
```

## Login Process

1. **Go to**: `http://localhost:3000/admin`
2. **Login popup will appear** automatically
3. **Enter credentials**:
   - Email: Your admin email
   - Password: Your admin password
4. **Click "Sign In"**
5. **You'll be redirected** to the admin dashboard

## Important Notes

### Admin Account Requirements

- ✅ **Email**: Must be unique
- ✅ **Password**: Will be hashed with bcrypt
- ✅ **is_verified**: Must be set to `1` (true) to login
- ✅ **Token**: Generated automatically on login

### If Login Fails

1. **Check if account exists**:
   ```sql
   SELECT * FROM admins WHERE email = 'your_email@example.com';
   ```

2. **Check if account is verified**:
   ```sql
   SELECT email, is_verified FROM admins WHERE email = 'your_email@example.com';
   ```
   - `is_verified` must be `1`

3. **Verify password**: Make sure you're using the correct password

4. **Check backend server**: Ensure backend is running on port 5000

5. **Check browser console**: Look for any error messages

## Password Reset

If you forgot your password:

1. **Go to**: `http://localhost:3000/admin`
2. **Click "Forgot Password?"** in the login popup
3. **Enter your email**
4. **Check your email** for reset link (or check server console in development)
5. **Click the reset link** or go to: `http://localhost:3000/admin/reset-password?token=YOUR_TOKEN`
6. **Enter new password**

## Troubleshooting

### Issue: Login popup doesn't appear
**Solution**: 
- Check if you're already logged in (check localStorage)
- Clear browser cache and localStorage
- Try incognito/private mode

### Issue: "Invalid email or password"
**Solution**:
- Verify email exists in database
- Check if password is correct
- Ensure account is verified (`is_verified = 1`)

### Issue: "Account not verified"
**Solution**:
- Update database: `UPDATE admins SET is_verified = 1 WHERE email = 'your_email@example.com';`

### Issue: CORS errors
**Solution**:
- Ensure backend is running on port 5000
- Check `server/index.js` CORS configuration
- Verify frontend is on port 3000

## Security Notes

- ⚠️ **Never commit admin credentials** to version control
- ⚠️ **Use strong passwords** for admin accounts
- ⚠️ **Change default passwords** immediately
- ⚠️ **Limit admin account creation** in production
- ⚠️ **Use environment variables** for sensitive data

## Quick Test

To quickly test if admin panel is accessible:

1. **Start backend**: `cd server && npm start`
2. **Start frontend**: `cd frontend && npm run dev`
3. **Open browser**: `http://localhost:3000/admin`
4. **You should see**: Login popup or dashboard (if already logged in)

## Default Admin Account (If Exists)

Check your database for any existing admin accounts:
```sql
SELECT id, name, email, is_verified FROM admins;
```

If no accounts exist, create one using the methods above.

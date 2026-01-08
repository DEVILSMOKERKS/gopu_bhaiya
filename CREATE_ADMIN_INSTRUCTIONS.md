# Create Admin Account - Quick Instructions

## Admin Credentials
- **Email**: `admin@123`
- **Password**: `Ajay@#$123`
- **Name**: `Admin`

## Method 1: Run SQL File (Easiest)

1. **Open your MySQL client** (MySQL Workbench, phpMyAdmin, or command line)
2. **Connect to your database**
3. **Run the SQL file**: `server/create-admin-account.sql`
   - Or copy and paste the SQL query from that file

## Method 2: Run SQL Query Directly

Copy and paste this SQL query into your MySQL client:

```sql
USE mateshwarimurti;

INSERT INTO admins (name, email, password, is_verified) 
VALUES (
  'Admin', 
  'admin@123', 
  '$2b$12$LOwKwCwP9d.zbD3V18ocPuMHxGVomSSBJWzFEkf296fFYJn1.j3PO', 
  1
);
```

## Method 3: Using Node.js Script (If Database is Configured)

If your database `.env` file is properly configured, you can run:

```bash
cd server
node create-admin.js "Admin" admin@123 "Ajay@#$123"
```

## Verify Admin Account

After creating, verify the account exists:

```sql
SELECT id, name, email, is_verified FROM admins WHERE email = 'admin@123';
```

You should see:
- `is_verified` = `1` (important for login!)
- Email = `admin@123`

## Login to Admin Panel

1. **Go to**: `http://localhost:3000/admin`
2. **Enter credentials**:
   - Email: `admin@123`
   - Password: `Ajay@#$123`
3. **Click "Sign In"**

## Troubleshooting

### If login fails:
1. Check if account exists: `SELECT * FROM admins WHERE email = 'admin@123';`
2. Ensure `is_verified = 1`: `UPDATE admins SET is_verified = 1 WHERE email = 'admin@123';`
3. Check backend is running on port 5000
4. Check frontend is running on port 3000

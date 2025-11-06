# Quick Start Guide

## Step 1: Create Environment Files

**Create `backend/.env` file with:**
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
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
```

**Create `frontend/.env` file with:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Step 2: Set Up MySQL Database

1. Make sure MySQL is running
2. Create the database:
```sql
CREATE DATABASE mateshwari_exports;
```

3. Run the schema:
```bash
mysql -u root -p mateshwari_exports < database/schema.sql
```

Or open MySQL and run the contents of `database/schema.sql`

## Step 3: Start the Project

Run this command in the project root:
```bash
npm run dev
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## Note
- If you don't have MySQL password, leave `DB_PASSWORD=` empty in backend/.env
- For development, you can use placeholder values for Razorpay, Cloudinary, and Shiprocket
- The app will work without these services, but payment and image upload features won't function


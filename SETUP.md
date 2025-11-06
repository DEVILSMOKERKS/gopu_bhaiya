# Mateshwari Exports - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm run install-all
```

Or manually:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Database Setup

1. Make sure MySQL is running on your system
2. Create the database:
```bash
mysql -u root -p
CREATE DATABASE mateshwari_exports;
exit
```

3. Run the schema:
```bash
mysql -u root -p mateshwari_exports < database/schema.sql
```

### 3. Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mateshwari_exports
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
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

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Create Admin User

After setting up the database, you can create an admin user manually in MySQL:

```sql
USE mateshwari_exports;
-- Password will be hashed by bcrypt
-- For testing, you can use a simple password and let the app hash it
-- Or use bcrypt to hash a password first
INSERT INTO users (name, email, passwordHash, role) 
VALUES ('Admin', 'admin@example.com', '$2a$10$YourHashedPasswordHere', 'admin');
```

Or create a normal user through registration and update the role:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 5. Run the Application

**Development Mode** (runs both frontend and backend):
```bash
npm run dev
```

**Separate Terminals**:
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm start`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Features

✅ Complete eCommerce functionality
✅ User authentication (JWT)
✅ Product catalog with filters
✅ Shopping cart and checkout
✅ Payment integration (Razorpay)
✅ Order management
✅ Wishlist
✅ Custom design requests
✅ Reviews and ratings
✅ Admin panel
✅ Virtual showroom (3D)
✅ Responsive design

## Testing Payment

For Razorpay testing, use test credentials:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: 123456

## Notes

- Make sure to update environment variables with your actual API keys
- The virtual showroom uses React Three Fiber - ensure 3D models are properly configured
- Image uploads require Cloudinary setup (or use a local storage solution)
- Shipping integration requires Shiprocket API credentials

## Troubleshooting

1. **Database connection error**: Check MySQL is running and credentials are correct
2. **Port already in use**: Change PORT in backend/.env
3. **CORS errors**: Ensure FRONTEND_URL in backend/.env matches your frontend URL
4. **Module not found**: Run `npm install` in both frontend and backend directories


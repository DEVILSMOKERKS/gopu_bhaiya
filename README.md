# Mateshwari-Murti

An e-commerce platform built with React and Node.js/Express, featuring a complete admin dashboard and user interface for managing products, orders, and customer interactions.

## Project Structure

```
Mateshwari-Murti/
├── frontend/          # React frontend application
├── server/            # Node.js/Express backend API
└── assets/            # Static assets
```

## Features

- **User Management**: Authentication and authorization system
- **Product Management**: Categories, subcategories, and product listings
- **Shopping Cart & Wishlist**: Add to cart and wishlist functionality
- **Order Management**: Complete order processing system
- **Reviews & Ratings**: Product review system
- **Blog System**: Content management for blogs
- **Admin Dashboard**: Comprehensive admin panel for managing the platform
- **Payment Integration**: Razorpay payment gateway integration
- **Email Notifications**: Automated email system using Nodemailer
- **Coupon & Offers**: Discount and promotional code system
- **Newsletter**: Email subscription management
- **Contact System**: Customer contact form handling

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Redux Toolkit
- Vite
- React Slick / Swiper
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MySQL2
- JWT Authentication
- Multer (File Upload)
- Bcrypt (Password Hashing)
- Razorpay (Payment Gateway)
- Nodemailer (Email Service)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL Database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Mateshwari-Murti
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:

Create a `.env` file in the `server` directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

5. Set up the database:
   - Import the SQL files from `server/database.sql` or `server/database_update.sql`
   - Configure your database connection in `server/config/db.js`

### Running the Application

1. Start the backend server:
```bash
cd server
npm start
# or
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## API Endpoints

The backend provides RESTful APIs for:
- Authentication (`/api/auth`)
- Admin operations (`/api/admin`)
- Products (`/api/products`)
- Categories (`/api/categories`)
- Orders (`/api/orders`)
- Cart (`/api/cart`)
- Wishlist (`/api/wishlist`)
- Reviews (`/api/reviews`)
- Blogs (`/api/blogs`)
- Contact (`/api/contact`)
- Newsletter (`/api/newsletter`)
- Coupons (`/api/coupons`)
- Offers (`/api/offers`)

## Build for Production

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

### Backend
The backend runs directly with Node.js. For production, consider using:
- PM2 for process management
- Environment-specific configurations
- Proper error logging and monitoring

## License

ISC

## Author

Podosphere


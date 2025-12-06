# Mateshwari-Murti

An e-commerce platform built with Next.js and Node.js/Express, featuring a complete admin dashboard and user interface for managing products, orders, and customer interactions.

## Project Structure

```
Mateshwari-Murti/
├── frontend/          # Next.js frontend application
│   ├── app/           # Next.js App Router pages
│   ├── src/           # React components, context, store, utils
│   ├── public/        # Static assets
│   └── next.config.js # Next.js configuration
├── server/            # Node.js/Express backend API
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Authentication and file upload middleware
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── index.js       # Server entry point
└── start.ps1          # PowerShell script to start both servers
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
- **Next.js 14** - React framework with App Router
- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Slick / Swiper** - Carousel components
- **Lucide React Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL Database
- npm or yarn
- PowerShell (for Windows start script)

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

**Backend** - Create a `.env` file in the `server` directory:
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

**Frontend** - Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
VITE_API_URL=http://localhost:5000/api
```

5. Set up the database:
   - Import the SQL file from `server/mateshwarimurti.sql`
   - Configure your database connection in `server/config/db.js`

### Running the Application

#### Option 1: Using PowerShell Script (Windows)
```powershell
.\start.ps1
```

This will start both backend and frontend servers in separate windows.

#### Option 2: Manual Start

1. Start the backend server:
```bash
cd server
npm run dev
# or
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: `http://localhost:3000` (Next.js default port)
- **Backend API**: `http://localhost:5000`

## API Endpoints

The backend provides RESTful APIs for:
- **Authentication** (`/api/auth`) - User login, registration
- **Admin Operations** (`/api/admin`) - Admin dashboard operations
- **Products** (`/api/products`) - Product CRUD operations
- **Categories** (`/api/categories`) - Category management
- **Subcategories** (`/api/subcategories`) - Subcategory management
- **Orders** (`/api/orders`) - Order processing
- **Cart** (`/api/cart`) - Shopping cart operations
- **Wishlist** (`/api/wishlist`) - Wishlist management
- **Reviews** (`/api/reviews`) - Product reviews
- **Blogs** (`/api/blogs`) - Blog management
- **Contact** (`/api/contact-us`) - Contact form submissions
- **Newsletter** (`/api/newsletter`) - Newsletter subscriptions
- **Coupons** (`/api/coupons`) - Coupon management
- **Offers** (`/api/offers`) - Offer management

## Build for Production

### Frontend
```bash
cd frontend
npm run build
npm start
```

The production build will be optimized by Next.js and can be served using `npm start` or deployed to platforms like Vercel, Netlify, etc.

### Backend
The backend runs directly with Node.js. For production, consider using:
- **PM2** for process management
- Environment-specific configurations
- Proper error logging and monitoring
- Reverse proxy (nginx) for better performance

## Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon (if configured)

## License

ISC

## Author

Podosphere


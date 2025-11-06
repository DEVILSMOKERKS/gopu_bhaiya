# Mateshwari Exports - Premium Marble Idol & Temple eCommerce

> Crafting Divinity, One Masterpiece at a Time

A luxury eCommerce platform for marble idols and temples, featuring a virtual showroom experience.

## 🚀 Tech Stack

- **Frontend**: React 18 + Redux Toolkit + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **3D Experience**: React Three Fiber
- **Payment**: Razorpay
- **Shipping**: Shiprocket

## 📁 Project Structure

```
mateshwari-exports/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
└── database/          # MySQL schema and migrations
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env` and fill in your values
   - Copy `frontend/.env.example` to `frontend/.env` and fill in your values

3. Set up MySQL database:
```bash
cd database
mysql -u root -p < schema.sql
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mateshwari_exports
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

## 🎨 Design Theme

- **Colors**: White, Gold, Marble textures
- **Fonts**: Cormorant Garamond (headings), Poppins (body)
- **Theme**: Spiritual luxury, minimalistic, elegant

## 📱 Features

- ✅ Product catalog with filtering and sorting
- ✅ 360° product view
- ✅ Virtual showroom experience
- ✅ Custom design requests
- ✅ User authentication and dashboard
- ✅ Admin panel
- ✅ Payment integration (Razorpay)
- ✅ Order management
- ✅ Reviews and testimonials
- ✅ Wishlist functionality

## 📄 License

ISC


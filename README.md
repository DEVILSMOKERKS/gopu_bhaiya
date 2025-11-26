# Saanz E-commerce Platform

A complete, modern e-commerce platform built with React, Node.js, and MySQL. Saanz provides a full-featured online shopping experience with user authentication, product management, shopping cart functionality, order processing, and an admin panel.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Product Browsing**: Browse products with search, filtering, and pagination
- **Shopping Cart**: Add, remove, and manage cart items
- **Order Management**: Place orders and track order status
- **Product Reviews**: Rate and review products
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Beautiful, intuitive interface with animations

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Category Management**: Organize products by categories
- **Order Management**: Process and track customer orders
- **User Management**: View and manage customer accounts
- **Dashboard**: Analytics and overview of store performance

### Technical Features
- **RESTful API**: Complete backend API with proper authentication
- **Database**: MySQL database with proper relationships
- **Security**: Password hashing, JWT authentication, input validation
- **Performance**: Optimized queries, lazy loading, and caching
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling and validation
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

## 📁 Project Structure

```
saanz/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, Cart)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── README.md
├── server/                  # Node.js backend application
│   ├── config/             # Database configuration
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── database.sql        # Database schema
│   ├── index.js            # Server entry point
│   └── README.md
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd saanz
```

### 2. Set Up the Database
1. Create a MySQL database named `saanz_db`
2. Run the SQL commands from `server/database.sql` to create tables and sample data

### 3. Set Up the Backend
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=saanz_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

Start the server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 4. Set Up the Frontend
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get all products (with pagination and filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Order Endpoints
- `POST /api/orders` - Create order from cart
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `PUT /api/orders/:id/payment` - Update payment status (Admin only)

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category with products
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

## 🎨 Customization

### Styling
The project uses Tailwind CSS for styling. You can customize the design by:
- Modifying the color scheme in `frontend/tailwind.config.js`
- Updating component styles in the respective component files
- Adding custom CSS in `frontend/src/index.css`

### Configuration
- **Database**: Update connection settings in `server/config/db.js`
- **API Base URL**: Change the API base URL in `frontend/src/services/api.js`
- **Environment Variables**: Modify the `.env` file for different environments

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated using express-validator
- **SQL Injection Prevention**: Parameterized queries prevent SQL injection
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Security Headers**: Helmet.js provides security headers

## 🧪 Testing

### Demo Account
You can use these credentials to test the application:
- **Email**: demo@example.com
- **Password**: password123

### Sample Data
The database comes with sample data including:
- 5 product categories
- 7 sample products with images
- Sample user accounts

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Deployment

### Backend Deployment
1. Set up a production MySQL database
2. Update environment variables for production
3. Deploy to your preferred hosting service (Heroku, DigitalOcean, AWS, etc.)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update the API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- All the open-source contributors whose libraries made this project possible

---

**Saanz E-commerce Platform** - Built with ❤️ for modern online shopping

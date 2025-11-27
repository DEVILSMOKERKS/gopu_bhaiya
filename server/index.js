const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.route');
const adminRoutes = require('./routes/admin.route');
const categoryRoutes = require('./routes/category.route');
const subcategoryRoutes = require('./routes/subcategory.route');
const productRoutes = require('./routes/product.route');
const offerRoutes = require('./routes/offer.route');
const couponRoutes = require('./routes/coupon.route');
const cartRoutes = require('./routes/cart.route');
const wishlistRoutes = require('./routes/wishlist.route');
const orderRoutes = require('./routes/order.route');
const reviewRoutes = require('./routes/review.route');
const blogRoutes = require('./routes/blog.route');
const contactRoutes = require('./routes/contact.route');
const newsletterRoutes = require('./routes/newsletter.route');
const PORT = process.env.PORT || 5000;

const app = express();

// CORS headers function for static files
const addStaticCorsHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
};

const allowOrigin = ['https://www.mateshwarimoortibhandar.com', 'http://localhost:5173'];
// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}


));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "http:", "https:"],
    },
  },
}));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files with CORS headers
app.use('/profile', addStaticCorsHeaders, express.static('public/profile'));
app.use('/blogs', addStaticCorsHeaders, express.static('public/blogs'));
app.use('/categories', addStaticCorsHeaders, express.static('public/categories'));
app.use('/subcategories', addStaticCorsHeaders, express.static('public/subcategories'));
app.use('/products', addStaticCorsHeaders, express.static('public/products'));
app.use('/reviews', addStaticCorsHeaders, express.static('public/reviews'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', blogRoutes);
app.use('/api', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mateshwari Moorti Bhandar API is running',
    timestamp: new Date().toISOString()
  });
});

// Welcome endpoint
app.get('/welcome', (req, res) => {
  res.send('Welcome to Mateshwari Moorti Bhandar E-commerce API');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mateshwari Moorti Bhandar server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

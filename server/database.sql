-- Create database
CREATE DATABASE IF NOT EXISTS saanz_db;

USE saanz_db;

-- ================================
-- USERS AND AUTHENTICATION
-- ================================
-- Newsletter subscribers table
CREATE TABLE
  IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    consent BOOLEAN NOT NULL DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    photo VARCHAR(255) UNIQUE,
    dob DATE,
    phone VARCHAR(20),
    anniversary DATE,
    address LONGTEXT CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_bin,
      is_verified TINYINT (1) DEFAULT 0,
      status ENUM ('Active', 'Inactive', 'Blocked') DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT address CHECK (json_valid (address))
  );

CREATE TABLE
  social_logins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    provider ENUM ('google', 'facebook'),
    provider_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user (id)
  );

-- =======================================
-- CATEGORIES TABLE
-- =======================================
CREATE TABLE
  categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    status ENUM ('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- =======================================
-- SUBCATEGORIES TABLE
-- =======================================
CREATE TABLE
  subcategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    status ENUM ('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
  );

-- ===============    product table ========================
CREATE TABLE
  products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    subcategory_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    fitting_info TEXT,
    fabric_info TEXT,
    care_info TEXT,
    product_detail TEXT,
    shipping_info TEXT,
    return_policy TEXT,
    status ENUM ('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories (id) ON DELETE SET NULL
  );

CREATE TABLE
  product_colors (
    color_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    color_name VARCHAR(50) NOT NULL,
    color_code VARCHAR(20), -- e.g. HEX code (#FF0000)
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
  );

CREATE TABLE
  product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    color_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (color_id) REFERENCES product_colors (color_id) ON DELETE CASCADE
  );

CREATE TABLE
  product_sizes (
    size_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size VARCHAR(20) NOT NULL, -- e.g. S, M, L, XL
    actual_price DECIMAL(10, 2) NOT NULL,
    sell_price DECIMAL(10, 2) NOT NULL,
    offer_percent INT DEFAULT 0,
    stock INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
  );

CREATE TABLE
  offers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    offer_title VARCHAR(255),
    offer_description TEXT,
    discount_percent INT DEFAULT 0,
    valid_from DATE,
    valid_to DATE,
    status ENUM ('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  );

-- ===============    CART TABLE ========================
CREATE TABLE
  cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    color_id INT,
    size_id INT,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES product_colors (color_id) ON DELETE SET NULL,
    FOREIGN KEY (size_id) REFERENCES product_sizes (size_id) ON DELETE SET NULL,
    UNIQUE KEY unique_cart_item (user_id, product_id, color_id, size_id)
  );

-- ===============    WISHLIST TABLE ========================
CREATE TABLE
  wishlist (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_item (user_id, product_id)
  );

-- ===============    ORDERS TABLE ========================
CREATE TABLE
  orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    order_status ENUM (
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned'
    ) DEFAULT 'pending',
    payment_status ENUM ('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_id VARCHAR(255),
    payment_method VARCHAR(50),
    shipping_address JSON,
    billing_address JSON,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    cod_fee DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    applied_coupon JSON,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
  );

-- ===============    ORDER ITEMS TABLE ========================
CREATE TABLE
  order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    color_id INT,
    size_id INT,
    quantity INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES product_colors (color_id) ON DELETE SET NULL,
    FOREIGN KEY (size_id) REFERENCES product_sizes (size_id) ON DELETE SET NULL
  );

-- ===============    ORDER TRACKING TABLE ========================
CREATE TABLE
  order_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status ENUM (
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned'
    ) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
  );

-- ===============    COUPONS TABLE ========================
CREATE TABLE
  coupons (
    coupon_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type ENUM ('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2),
    usage_limit INT DEFAULT 1,
    used_count INT DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    status ENUM ('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- ===============    COUPON USAGE TABLE ========================
CREATE TABLE
  coupon_usage (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons (coupon_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
  );

-- ===============    SAMPLE COUPON DATA ========================
INSERT INTO
  coupons (
    code,
    name,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    max_discount,
    usage_limit,
    valid_from,
    valid_to,
    status
  )
VALUES
  (
    'WELCOME10',
    'Welcome Discount',
    'Get 10% off on your first order',
    'percentage',
    10.00,
    500.00,
    200.00,
    100,
    '2024-01-01',
    '2024-12-31',
    'active'
  ),
  (
    'SAVE50',
    'Save 50',
    'Get ₹50 off on orders above ₹1000',
    'fixed',
    50.00,
    1000.00,
    NULL,
    50,
    '2024-01-01',
    '2024-12-31',
    'active'
  ),
  (
    'FLAT20',
    'Flat 20% Off',
    'Get 20% off on all orders',
    'percentage',
    20.00,
    300.00,
    500.00,
    200,
    '2024-01-01',
    '2024-12-31',
    'active'
  );

-- ===============    PRODUCT REVIEWS TABLE ========================
CREATE TABLE
  product_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (
      rating >= 1
      AND rating <= 5
    ),
    review_text TEXT,
    review_image VARCHAR(500),
    status ENUM ('pending', 'approved', 'rejected') DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_review (user_id, product_id)
  );

-- ===============    REVIEW LIKES TABLE ========================
CREATE TABLE
  review_likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES product_reviews (review_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_review_like (user_id, review_id)
  );

-- ===============    BLOG TABLES ========================
CREATE TABLE
  blogs (
    blog_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    author_id INT NOT NULL,
    status ENUM ('draft', 'published', 'archived') DEFAULT 'draft',
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags JSON,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES admins (id) ON DELETE CASCADE
  );

  CREATE TABLE
    IF NOT EXISTS contact_queries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM ('pending', 'in_progress', 'resolved', 'closed') DEFAULT 'pending',
        admin_notes TEXT,
        resolved_by INT,
        resolved_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (resolved_by) REFERENCES admins (id) ON DELETE SET NULL
    );


-- Insert sample blog posts
INSERT INTO
  blogs (
    title,
    slug,
    content,
    featured_image,
    author_id,
    status,
    meta_title,
    meta_description,
    tags
  )
VALUES
  (
    'Master the Art of Timeless and Trendy Wardrobe Styling',
    'master-art-timeless-trendy-wardrobe-styling',
    '<h2>Introduction</h2><p>Creating a timeless and trendy wardrobe is an art that combines classic pieces with contemporary flair. In this comprehensive guide, we\'ll explore how to build a wardrobe that stands the test of time while keeping up with current trends.</p><h2>Understanding Timeless Fashion</h2><p>Timeless fashion pieces are those that never go out of style. These include classic items like:</p><ul><li>White button-down shirts</li><li>Well-fitted blazers</li><li>Little black dresses</li><li>High-quality denim</li><li>Neutral-colored sweaters</li></ul><h2>Incorporating Trends</h2><p>While timeless pieces form the foundation, trendy items add personality and keep your look current. The key is to invest in trends that complement your existing wardrobe rather than replacing it entirely.</p><h2>Building Your Capsule Wardrobe</h2><p>A capsule wardrobe consists of versatile pieces that can be mixed and matched to create numerous outfits. Start with 30-40 high-quality items that reflect your personal style and lifestyle needs.</p><h2>Color Coordination</h2><p>Choose a color palette that works well together. Neutral colors like black, white, navy, and beige form the base, while accent colors add interest and personality.</p><h2>Quality Over Quantity</h2><p>Invest in well-made pieces that will last. Look for quality fabrics, good construction, and timeless designs that won\'t quickly go out of style.</p><h2>Conclusion</h2><p>Building a timeless and trendy wardrobe is a journey that requires patience and thoughtful consideration. By focusing on quality, versatility, and personal style, you can create a wardrobe that serves you well for years to come.</p>',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    1,
    'published',
    'Master the Art of Timeless and Trendy Wardrobe Styling',
    'Learn how to create a wardrobe that combines timeless classics with contemporary trends for a style that never goes out of fashion.',
    '["fashion", "styling", "wardrobe", "timeless", "trendy"]'
  ),
  (
    'Timeless Style Tips for a Trendy, Confident You',
    'timeless-style-tips-trendy-confident-you',
    '<h2>Building Confidence Through Style</h2><p>Your personal style is a powerful tool for building confidence and expressing your unique personality. When you feel good about what you\'re wearing, it shows in your posture, attitude, and interactions with others.</p><h2>Understanding Your Body Type</h2><p>The first step to confident styling is understanding your body type and learning what works best for you. Whether you\'re pear-shaped, apple-shaped, hourglass, or rectangular, there are flattering styles for every body type.</p><h2>Color Psychology</h2><p>Colors have a profound effect on our mood and how others perceive us. Understanding color psychology can help you choose outfits that convey the right message for different situations.</p><h2>Accessorizing with Purpose</h2><p>Accessories are the finishing touches that complete your look. From statement jewelry to scarves and belts, the right accessories can transform a simple outfit into something special.</p><h2>Dressing for Different Occasions</h2><p>Different occasions call for different styles. Learn how to adapt your wardrobe for work, casual outings, formal events, and everything in between.</p><h2>Maintaining Your Style</h2><p>Style is not just about what you wear, but how you maintain your appearance. Regular grooming, proper clothing care, and attention to detail all contribute to a polished look.</p><h2>Conclusion</h2><p>Confident styling is about more than just following trends. It\'s about understanding yourself, your body, and how to present the best version of yourself to the world.</p>',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
    1,
    'published',
    'Timeless Style Tips for a Trendy, Confident You',
    'Discover how to build confidence through personal style and create looks that make you feel empowered and authentic.',
    '["confidence", "style", "fashion", "personal-development", "self-expression"]'
  ),
  (
    'Upgrade Your Wardrobe with Timeless and Trendy Fashion Tips',
    'upgrade-wardrobe-timeless-trendy-fashion-tips',
    '<h2>Wardrobe Assessment</h2><p>Before upgrading your wardrobe, take time to assess what you currently have. Identify pieces you love and wear frequently, as well as items that no longer serve you.</p><h2>Investment Pieces</h2><p>Certain pieces are worth investing in because they form the foundation of a great wardrobe. These include well-made coats, quality shoes, and versatile bags that can be worn for years.</p><h2>Seasonal Updates</h2><p>Instead of completely overhauling your wardrobe each season, focus on adding a few key pieces that complement what you already own. This approach is more sustainable and cost-effective.</p><h2>Sustainable Fashion</h2><p>Consider the environmental impact of your fashion choices. Look for brands that use sustainable materials and ethical manufacturing processes.</p><h2>Mixing High and Low</h2><p>You don\'t need to spend a fortune to look great. Learn how to mix high-end investment pieces with affordable finds to create a balanced wardrobe.</p><h2>Care and Maintenance</h2><p>Proper care extends the life of your clothing. Learn how to wash, store, and maintain your garments to keep them looking their best.</p><h2>Conclusion</h2><p>Upgrading your wardrobe is an ongoing process that should reflect your personal growth and changing lifestyle needs.</p>',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    1,
    'published',
    'Upgrade Your Wardrobe with Timeless and Trendy Fashion Tips',
    'Transform your wardrobe with smart shopping strategies and timeless fashion principles that will serve you for years to come.',
    '["wardrobe", "fashion", "sustainable", "investment", "style"]'
  );
SET
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET
  time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE
  `admins` (
    `id` int (11) NOT NULL,
    `name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `password` varchar(255) NOT NULL,
    `photo` varchar(255) DEFAULT NULL,
    `is_verified` tinyint (1) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `reset_token` varchar(255) DEFAULT NULL,
    `reset_token_expiry` timestamp NULL DEFAULT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `blogs` (
    `blog_id` int (11) NOT NULL,
    `title` varchar(255) NOT NULL,
    `slug` varchar(255) NOT NULL,
    `content` text NOT NULL,
    `excerpt` text DEFAULT NULL,
    `featured_image` varchar(500) DEFAULT NULL,
    `author_id` int (11) NOT NULL,
    `status` enum ('draft', 'published', 'archived') DEFAULT 'draft',
    `meta_title` varchar(255) DEFAULT NULL,
    `meta_description` text DEFAULT NULL,
    `tags` longtext CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
      `view_count` int (11) DEFAULT 0,
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `blog_categories` (
    `category_id` int (11) NOT NULL,
    `name` varchar(100) NOT NULL,
    `slug` varchar(100) NOT NULL,
    `description` text DEFAULT NULL,
    `status` enum ('active', 'inactive') DEFAULT 'active',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `blog_category_relations` (
    `relation_id` int (11) NOT NULL,
    `blog_id` int (11) NOT NULL,
    `category_id` int (11) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `cart` (
    `cart_id` int (11) NOT NULL,
    `user_id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `color_id` int (11) DEFAULT NULL,
    `size_id` int (11) DEFAULT NULL,
    `quantity` int (11) NOT NULL DEFAULT 1,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `categories` (
    `id` int (11) NOT NULL,
    `name` varchar(100) NOT NULL,
    `slug` varchar(100) NOT NULL,
    `description` text DEFAULT NULL,
    `meta_title` varchar(255) DEFAULT NULL,
    `meta_description` text DEFAULT NULL,
    `image_url` varchar(255) DEFAULT NULL,
    `status` enum ('active', 'inactive') DEFAULT 'active',
    `sort_order` int (11) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `contact_queries` (
    `id` int (11) NOT NULL,
    `name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `phone` varchar(20) NOT NULL,
    `subject` varchar(255) NOT NULL,
    `message` text NOT NULL,
    `status` enum ('pending', 'in_progress', 'resolved', 'closed') DEFAULT 'pending',
    `admin_notes` text DEFAULT NULL,
    `resolved_by` int (11) DEFAULT NULL,
    `resolved_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `expert_consultations` (
    `id` int (11) NOT NULL,
    `full_name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `city` varchar(100) NOT NULL,
    `about_yourself` enum ('homeowner', 'designer') NOT NULL,
    `status` enum (
      'pending',
      'contacted',
      'in_progress',
      'completed',
      'closed'
    ) DEFAULT 'pending',
    `admin_notes` text DEFAULT NULL,
    `contacted_by` int (11) DEFAULT NULL,
    `contacted_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `coupons` (
    `coupon_id` int (11) NOT NULL,
    `code` varchar(50) NOT NULL,
    `name` varchar(100) NOT NULL,
    `description` text DEFAULT NULL,
    `discount_type` enum ('percentage', 'fixed') NOT NULL,
    `discount_value` decimal(10, 2) NOT NULL,
    `min_order_amount` decimal(10, 2) DEFAULT 0.00,
    `max_discount` decimal(10, 2) DEFAULT NULL,
    `usage_limit` int (11) DEFAULT 1,
    `used_count` int (11) DEFAULT 0,
    `valid_from` date NOT NULL,
    `valid_to` date NOT NULL,
    `status` enum ('active', 'inactive') DEFAULT 'active',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `coupon_usage` (
    `usage_id` int (11) NOT NULL,
    `coupon_id` int (11) NOT NULL,
    `user_id` int (11) NOT NULL,
    `order_id` int (11) NOT NULL,
    `discount_amount` decimal(10, 2) NOT NULL,
    `used_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `newsletter_subscribers` (
    `id` int (11) NOT NULL,
    `email` varchar(255) NOT NULL,
    `consent` tinyint (1) NOT NULL DEFAULT 1,
    `subscribed_at` timestamp NULL DEFAULT current_timestamp(),
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `orders` (
    `order_id` int (11) NOT NULL,
    `order_number` varchar(50) NOT NULL,
    `user_id` int (11) NOT NULL,
    `order_status` enum (
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned'
    ) DEFAULT 'pending',
    `payment_status` enum ('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    `payment_id` varchar(255) DEFAULT NULL,
    `payment_method` varchar(50) DEFAULT NULL,
    `shipping_address` longtext CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
      `billing_address` longtext CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
      `discount_amount` decimal(10, 2) DEFAULT 0.00,
      `shipping_fee` decimal(10, 2) DEFAULT 0.00,
      `cod_fee` decimal(10, 2) DEFAULT 0.00,
      `final_amount` decimal(10, 2) NOT NULL,
      `applied_coupon` longtext CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
      `tracking_number` varchar(100) DEFAULT NULL,
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `order_items` (
    `order_item_id` int (11) NOT NULL,
    `order_id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `color_id` int (11) DEFAULT NULL,
    `size_id` int (11) DEFAULT NULL,
    `quantity` int (11) NOT NULL DEFAULT 1,
    `total_price` decimal(10, 2) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `order_tracking` (
    `tracking_id` int (11) NOT NULL,
    `order_id` int (11) NOT NULL,
    `status` enum (
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned'
    ) NOT NULL,
    `description` text DEFAULT NULL,
    `location` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `products` (
    `product_id` int (11) NOT NULL,
    `sku` varchar(100) DEFAULT NULL,
    `category_id` int (11) DEFAULT NULL,
    `subcategory_id` int (11) DEFAULT NULL,
    `name` varchar(255) NOT NULL,
    `slug` varchar(255) DEFAULT NULL,
    `meta_title` varchar(255) DEFAULT NULL,
    `meta_description` text DEFAULT NULL,
    `featured_image` varchar(500) DEFAULT NULL,
    `video_url` varchar(500) DEFAULT NULL,
    `tags` varchar(500) DEFAULT NULL,
    `is_featured` tinyint (1) DEFAULT 0,
    `is_new` tinyint (1) DEFAULT 0,
    `is_bestseller` tinyint (1) DEFAULT 0,
    `is_customizable` tinyint (1) DEFAULT 0,
    `ask_for_price` tinyint (1) DEFAULT 0,
    `min_order_quantity` int (11) DEFAULT 1,
    `lead_time_days` int (11) DEFAULT NULL,
    `view_count` int (11) DEFAULT 0,
    `description` text DEFAULT NULL,
    `product_detail` text DEFAULT NULL,
    `shipping_info` text DEFAULT NULL,
    `return_policy` text DEFAULT NULL,
    `status` enum ('active', 'inactive') DEFAULT 'active',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `product_colors` (
    `color_id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `color_name` varchar(50) NOT NULL,
    `color_code` varchar(20) DEFAULT NULL,
    `sort_order` int (11) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `product_images` (
    `image_id` int (11) NOT NULL,
    `color_id` int (11) NOT NULL,
    `image_url` varchar(500) NOT NULL,
    `alt_text` varchar(255) DEFAULT NULL,
    `sort_order` int (11) DEFAULT 0,
    `is_default` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `product_offers` (
    `offer_id` int (11) NOT NULL,
    `product_id` int (11) DEFAULT NULL,
    `offer_title` varchar(255) DEFAULT NULL,
    `offer_description` text DEFAULT NULL,
    `discount_percent` int (11) DEFAULT 0,
    `valid_from` date DEFAULT NULL,
    `valid_to` date DEFAULT NULL,
    `status` enum ('active', 'inactive') DEFAULT 'active',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `product_reviews` (
    `review_id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `user_id` int (11) NOT NULL,
    `rating` int (11) NOT NULL,
    `review_text` text DEFAULT NULL,
    `review_image` varchar(500) DEFAULT NULL,
    `helpful_count` int (11) DEFAULT 0,
    `status` enum ('pending', 'approved', 'rejected') DEFAULT 'pending',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `product_sizes` (
    `size_id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `size` varchar(20) NOT NULL,
    `height` decimal(10, 2) DEFAULT NULL,
    `width` decimal(10, 2) DEFAULT NULL,
    `depth` decimal(10, 2) DEFAULT NULL,
    `weight` decimal(10, 2) DEFAULT NULL,
    `dimensions_unit` varchar(10) DEFAULT 'cm',
    `weight_unit` varchar(10) DEFAULT 'kg',
    `actual_price` decimal(10, 2) NOT NULL,
    `sell_price` decimal(10, 2) NOT NULL,
    `offer_percent` int (11) DEFAULT 0,
    `stock` int (11) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `review_likes` (
    `like_id` int (11) NOT NULL,
    `review_id` int (11) NOT NULL,
    `user_id` int (11) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `social_logins` (
    `id` int (11) NOT NULL,
    `user_id` int (11) DEFAULT NULL,
    `provider` enum ('google', 'facebook') DEFAULT NULL,
    `provider_id` varchar(255) DEFAULT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `subcategories` (
    `id` int (11) NOT NULL,
    `category_id` int (11) NOT NULL,
    `name` varchar(100) NOT NULL,
    `slug` varchar(100) NOT NULL,
    `description` text DEFAULT NULL,
    `image_url` varchar(255) DEFAULT NULL,
    `status` enum ('active', 'inactive') DEFAULT 'active',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `user` (
    `id` int (11) NOT NULL,
    `name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `password` varchar(255) NOT NULL,
    `photo` varchar(255) DEFAULT NULL,
    `dob` date DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `anniversary` date DEFAULT NULL,
    `address` longtext CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
      `is_verified` tinyint (1) DEFAULT 0,
      `status` enum ('Active', 'Inactive', 'Blocked') DEFAULT 'Active',
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `wishlist` (
    `wishlist_id` int (11) NOT NULL,
    `user_id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
  `product_attributes` (
    `attribute_id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `attribute_name` varchar(100) NOT NULL,
    `attribute_value` varchar(255) NOT NULL,
    `sort_order` int (11) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

  CREATE TABLE `expert_inquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `status` enum('pending', 'contacted', 'resolved') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `admins` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `blogs` ADD PRIMARY KEY (`blog_id`),
ADD UNIQUE KEY `slug` (`slug`),
ADD KEY `author_id` (`author_id`);

ALTER TABLE `blog_categories` ADD PRIMARY KEY (`category_id`),
ADD UNIQUE KEY `slug` (`slug`);

ALTER TABLE `blog_category_relations` ADD PRIMARY KEY (`relation_id`),
ADD UNIQUE KEY `unique_blog_category` (`blog_id`, `category_id`),
ADD KEY `category_id` (`category_id`);

ALTER TABLE `cart` ADD PRIMARY KEY (`cart_id`),
ADD UNIQUE KEY `unique_cart_item` (`user_id`, `product_id`, `color_id`, `size_id`),
ADD KEY `product_id` (`product_id`),
ADD KEY `color_id` (`color_id`),
ADD KEY `size_id` (`size_id`);

ALTER TABLE `categories` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `slug` (`slug`);

ALTER TABLE `contact_queries` ADD PRIMARY KEY (`id`),
ADD KEY `resolved_by` (`resolved_by`);

ALTER TABLE `expert_consultations` ADD PRIMARY KEY (`id`),
ADD KEY `contacted_by` (`contacted_by`),
ADD KEY `status` (`status`),
ADD KEY `created_at` (`created_at`);

ALTER TABLE `coupons` ADD PRIMARY KEY (`coupon_id`),
ADD UNIQUE KEY `code` (`code`);

ALTER TABLE `coupon_usage` ADD PRIMARY KEY (`usage_id`),
ADD KEY `coupon_id` (`coupon_id`),
ADD KEY `user_id` (`user_id`),
ADD KEY `order_id` (`order_id`);

ALTER TABLE `newsletter_subscribers` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`),
ADD KEY `idx_newsletter_email` (`email`),
ADD KEY `idx_newsletter_subscribed_at` (`subscribed_at`);

ALTER TABLE `orders` ADD PRIMARY KEY (`order_id`),
ADD UNIQUE KEY `order_number` (`order_number`),
ADD KEY `user_id` (`user_id`);

ALTER TABLE `order_items` ADD PRIMARY KEY (`order_item_id`),
ADD KEY `order_id` (`order_id`),
ADD KEY `product_id` (`product_id`),
ADD KEY `color_id` (`color_id`),
ADD KEY `size_id` (`size_id`);

ALTER TABLE `order_tracking` ADD PRIMARY KEY (`tracking_id`),
ADD KEY `order_id` (`order_id`);

ALTER TABLE `products` ADD PRIMARY KEY (`product_id`),
ADD UNIQUE KEY `unique_sku` (`sku`),
ADD UNIQUE KEY `unique_slug` (`slug`),
ADD KEY `category_id` (`category_id`),
ADD KEY `subcategory_id` (`subcategory_id`);

ALTER TABLE `product_colors` ADD PRIMARY KEY (`color_id`),
ADD KEY `product_id` (`product_id`);

ALTER TABLE `product_images` ADD PRIMARY KEY (`image_id`),
ADD KEY `color_id` (`color_id`);

ALTER TABLE `product_offers` ADD PRIMARY KEY (`offer_id`),
ADD KEY `product_offers_ibfk_1` (`product_id`);

ALTER TABLE `product_reviews` ADD PRIMARY KEY (`review_id`),
ADD UNIQUE KEY `unique_user_product_review` (`user_id`, `product_id`),
ADD KEY `product_id` (`product_id`);

ALTER TABLE `product_sizes` ADD PRIMARY KEY (`size_id`),
ADD KEY `product_id` (`product_id`);

ALTER TABLE `review_likes` ADD PRIMARY KEY (`like_id`),
ADD UNIQUE KEY `unique_user_review_like` (`user_id`, `review_id`),
ADD KEY `review_id` (`review_id`);

ALTER TABLE `social_logins` ADD PRIMARY KEY (`id`),
ADD KEY `user_id` (`user_id`);

ALTER TABLE `subcategories` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `slug` (`slug`),
ADD KEY `category_id` (`category_id`);

ALTER TABLE `user` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`),
ADD UNIQUE KEY `photo` (`photo`);

ALTER TABLE `wishlist` ADD PRIMARY KEY (`wishlist_id`),
ADD UNIQUE KEY `unique_wishlist_item` (`user_id`, `product_id`),
ADD KEY `product_id` (`product_id`);

ALTER TABLE `product_attributes` ADD PRIMARY KEY (`attribute_id`),
ADD KEY `product_id` (`product_id`);

ALTER TABLE `admins` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `blogs` MODIFY `blog_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `blog_categories` MODIFY `category_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `blog_category_relations` MODIFY `relation_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cart` MODIFY `cart_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `categories` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `contact_queries` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `expert_consultations` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `coupons` MODIFY `coupon_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `coupon_usage` MODIFY `usage_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `newsletter_subscribers` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `orders` MODIFY `order_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `order_items` MODIFY `order_item_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `order_tracking` MODIFY `tracking_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `products` MODIFY `product_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `product_colors` MODIFY `color_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `product_images` MODIFY `image_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `product_offers` MODIFY `offer_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `product_reviews` MODIFY `review_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `product_sizes` MODIFY `size_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `review_likes` MODIFY `like_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `social_logins` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `subcategories` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `user` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `wishlist` MODIFY `wishlist_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `product_attributes` MODIFY `attribute_id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `blogs` ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

ALTER TABLE `blog_category_relations` ADD CONSTRAINT `blog_category_relations_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`blog_id`) ON DELETE CASCADE,
ADD CONSTRAINT `blog_category_relations_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`category_id`) ON DELETE CASCADE;

ALTER TABLE `cart` ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
ADD CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `product_colors` (`color_id`) ON DELETE SET NULL,
ADD CONSTRAINT `cart_ibfk_4` FOREIGN KEY (`size_id`) REFERENCES `product_sizes` (`size_id`) ON DELETE SET NULL;

ALTER TABLE `contact_queries` ADD CONSTRAINT `contact_queries_ibfk_1` FOREIGN KEY (`resolved_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

ALTER TABLE `expert_consultations` ADD CONSTRAINT `expert_consultations_ibfk_1` FOREIGN KEY (`contacted_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

ALTER TABLE `coupon_usage` ADD CONSTRAINT `coupon_usage_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`) ON DELETE CASCADE,
ADD CONSTRAINT `coupon_usage_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `coupon_usage_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `order_items` ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `product_colors` (`color_id`) ON DELETE SET NULL,
ADD CONSTRAINT `order_items_ibfk_4` FOREIGN KEY (`size_id`) REFERENCES `product_sizes` (`size_id`) ON DELETE SET NULL;

ALTER TABLE `order_tracking` ADD CONSTRAINT `order_tracking_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL;

ALTER TABLE `product_colors` ADD CONSTRAINT `product_colors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

ALTER TABLE `product_images` ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`color_id`) REFERENCES `product_colors` (`color_id`) ON DELETE CASCADE;

ALTER TABLE `product_offers` ADD CONSTRAINT `product_offers_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL;

ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
ADD CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `product_sizes` ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

ALTER TABLE `review_likes` ADD CONSTRAINT `review_likes_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `product_reviews` (`review_id`) ON DELETE CASCADE,
ADD CONSTRAINT `review_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `social_logins` ADD CONSTRAINT `social_logins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `subcategories` ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

ALTER TABLE `product_attributes` ADD CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

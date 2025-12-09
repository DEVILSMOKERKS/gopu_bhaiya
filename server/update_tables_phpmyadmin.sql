ALTER TABLE `products`
DROP COLUMN `fitting_info`;

ALTER TABLE `products`
DROP COLUMN `fabric_info`;

ALTER TABLE `products`
DROP COLUMN `care_info`;

ALTER TABLE `products`
ADD COLUMN `sku` VARCHAR(100) NULL AFTER `product_id`;

ALTER TABLE `products`
ADD COLUMN `slug` VARCHAR(255) NULL AFTER `name`;

ALTER TABLE `products`
ADD COLUMN `meta_title` VARCHAR(255) NULL AFTER `slug`;

ALTER TABLE `products`
ADD COLUMN `meta_description` TEXT NULL AFTER `meta_title`;

ALTER TABLE `products`
ADD COLUMN `featured_image` VARCHAR(500) NULL AFTER `meta_description`;

ALTER TABLE `products`
ADD COLUMN `video_url` VARCHAR(500) NULL AFTER `featured_image`;

ALTER TABLE `products`
ADD COLUMN `tags` VARCHAR(500) NULL AFTER `video_url`;

ALTER TABLE `products`
ADD COLUMN `is_featured` TINYINT (1) DEFAULT 0 AFTER `tags`;

ALTER TABLE `products`
ADD COLUMN `is_new` TINYINT (1) DEFAULT 0 AFTER `is_featured`;

ALTER TABLE `products`
ADD COLUMN `is_bestseller` TINYINT (1) DEFAULT 0 AFTER `is_new`;

ALTER TABLE `products`
ADD COLUMN `is_customizable` TINYINT (1) DEFAULT 0 AFTER `is_bestseller`;

ALTER TABLE `products`
ADD COLUMN `min_order_quantity` INT (11) DEFAULT 1 AFTER `is_customizable`;

ALTER TABLE `products`
ADD COLUMN `lead_time_days` INT (11) NULL AFTER `min_order_quantity`;

ALTER TABLE `products`
ADD COLUMN `view_count` INT (11) DEFAULT 0 AFTER `lead_time_days`;

ALTER TABLE `products` ADD UNIQUE KEY `unique_sku` (`sku`);

ALTER TABLE `products` ADD UNIQUE KEY `unique_slug` (`slug`);

ALTER TABLE `product_sizes`
ADD COLUMN `height` DECIMAL(10, 2) NULL AFTER `size`;

ALTER TABLE `product_sizes`
ADD COLUMN `width` DECIMAL(10, 2) NULL AFTER `height`;

ALTER TABLE `product_sizes`
ADD COLUMN `depth` DECIMAL(10, 2) NULL AFTER `width`;

ALTER TABLE `product_sizes`
ADD COLUMN `weight` DECIMAL(10, 2) NULL AFTER `depth`;

ALTER TABLE `product_sizes`
ADD COLUMN `dimensions_unit` VARCHAR(10) DEFAULT 'cm' AFTER `weight`;

ALTER TABLE `product_sizes`
ADD COLUMN `weight_unit` VARCHAR(10) DEFAULT 'kg' AFTER `dimensions_unit`;

ALTER TABLE `product_images`
ADD COLUMN `alt_text` VARCHAR(255) NULL AFTER `image_url`;

ALTER TABLE `product_images`
ADD COLUMN `sort_order` INT (11) DEFAULT 0 AFTER `alt_text`;

ALTER TABLE `product_colors`
ADD COLUMN `sort_order` INT (11) DEFAULT 0 AFTER `color_code`;

ALTER TABLE `product_reviews`
ADD COLUMN `helpful_count` INT (11) DEFAULT 0 AFTER `review_image`;

ALTER TABLE `categories`
ADD COLUMN `meta_title` VARCHAR(255) NULL AFTER `description`;

ALTER TABLE `categories`
ADD COLUMN `meta_description` TEXT NULL AFTER `meta_title`;

ALTER TABLE `categories`
ADD COLUMN `sort_order` INT (11) DEFAULT 0 AFTER `status`;

CREATE TABLE
  `product_attributes` (
    `attribute_id` INT (11) NOT NULL AUTO_INCREMENT,
    `product_id` INT (11) NOT NULL,
    `attribute_name` VARCHAR(100) NOT NULL,
    `attribute_value` VARCHAR(255) NOT NULL,
    `sort_order` INT (11) DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`attribute_id`),
    KEY `product_id` (`product_id`),
    CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
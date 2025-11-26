-- Database update script to remove blog categories and excerpt column
-- Run this script on your existing database to apply the changes
USE saanz_db;

-- Drop blog category related tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS blog_category_relations;

DROP TABLE IF EXISTS blog_categories;

-- Remove excerpt column from blogs table
ALTER TABLE blogs
DROP COLUMN IF EXISTS excerpt;

-- ========================================
-- CONTACT US TABLE
-- ========================================
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

-- Create index for better performance
CREATE INDEX idx_contact_status ON contact_queries (status);

CREATE INDEX idx_contact_created_at ON contact_queries (created_at);

CREATE INDEX idx_contact_email ON contact_queries (email);

-- ========================================
-- RESET TOKEN COLUMNS NOT NEEDED
-- ========================================
-- Token-based password reset will be handled without database columns
-- Using in-memory token storage or external token service
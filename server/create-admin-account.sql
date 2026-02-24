-- Create Admin Account
-- Email: admin@123
-- Password: Ajay@#$123

-- First, make sure you're using the correct database
USE mateshwarimurti;

-- Insert admin account with hashed password
INSERT INTO admins (name, email, password, is_verified) 
VALUES (
  'Admin', 
  'sarthakpandey1210@gmail.com', 
  'sarthak@123', 
  1
);

-- Verify the admin was created
SELECT id, name, email, is_verified, created_at FROM admins WHERE email = 'admin@gmail.com';

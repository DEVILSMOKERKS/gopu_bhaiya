-- Create Admin Account
-- Email: admin@123
-- Password: Ajay@#$123

-- First, make sure you're using the correct database
USE mateshwarimurti;

-- Insert admin account with hashed password
INSERT INTO admins (name, email, password, is_verified) 
VALUES (
  'Admin', 
  'admin@123', 
  '$2b$12$LOwKwCwP9d.zbD3V18ocPuMHxGVomSSBJWzFEkf296fFYJn1.j3PO', 
  1
);

-- Verify the admin was created
SELECT id, name, email, is_verified, created_at FROM admins WHERE email = 'admin@123';

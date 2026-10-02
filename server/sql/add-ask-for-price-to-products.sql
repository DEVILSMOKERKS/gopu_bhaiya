ALTER TABLE products
ADD COLUMN ask_for_price TINYINT(1) DEFAULT 0 AFTER is_customizable;

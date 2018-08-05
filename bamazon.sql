DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
item_id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(50) NULL,
-- electronics, clothing, furniture --
department_name VARCHAR(50) NULL,
price DECIMAL(7,2) NULL,
stock_quantity TINYINT UNSIGNED, 
PRIMARY KEY(item_id)
);

INSERT INTO products 
	VALUES (1, 'cat sweater', 'clothing', 5.50, 10),
		   (2, 'chifferobe', 'furniture', 249.99, 4),
           (3, 'lamp', 'furniture', 25.99, 5),
           (4, 'kabuki mask', 'clothing', 49.99, 6),
           (5, 'monitor', 'electronics', 129.99, 5),
           (6, 'gamecube', 'electronics', 49.99, 5),
           (7, 'super nintendo', 'electronics', 79.95, 8),
           (8, 'davenport', 'furniture', 299.95, 9),
           (9, 'kilt', 'clothing', 70.00, 10),
           (10, 'divan', 'furniture', 249.99, 7);


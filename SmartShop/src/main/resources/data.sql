-- 1. CLEAN EXISTING DATA (Optional - Be careful!)
TRUNCATE TABLE payment, order_item, orders, product, client, users RESTART IDENTITY CASCADE;

-- 2. INSERT USERS
-- Password is 'admin123' and 'client123' (plain text as per your config)
INSERT INTO users (username, password, role) VALUES
('admin', 'pass123', 'ADMIN'),
('techsolutions', 'pass123', 'CLIENT');

-- 3. INSERT CLIENTS
-- Linked to user 'techsolutions' (user_id = 2)
INSERT INTO client (name, email, tier, total_orders, total_spent, first_order_date, last_order_date, user_id) VALUES
('Tech Solutions SARL', 'contact@techsolutions.ma', 'GOLD', 15, 25000.00, '2024-01-15', '2024-11-20', 2),
('Info Maroc', 'info@infomaroc.ma', 'BASIC', 0, 0.00, NULL, NULL, NULL);

-- 4. INSERT PRODUCTS
INSERT INTO product (name, unit_priceht, stock_available, deleted) VALUES
('Laptop Dell Latitude 5520', 8500.00, 50, false),
('Ecran Samsung 24 pouces', 1200.00, 100, false),
('Souris Logitech Sans Fil', 150.00, 200, false),
('Imprimante HP LaserJet Pro', 2500.00, 30, false),
('Serveur Dell PowerEdge', 15000.00, 10, false);

-- 5. INSERT ORDERS
-- Order 1: Confirmed for Tech Solutions
INSERT INTO orders (client_id, created_at, status, sub_totalht, discount_amount, ht_after_discount, tax_amount, totalttc, amount_remaining, promo_code) VALUES
(1, '2024-11-20 10:30:00', 'CONFIRMED', 17000.00, 0.00, 17000.00, 3400.00, 20400.00, 0.00, NULL);

-- Order 2: Pending for Tech Solutions
INSERT INTO orders (client_id, created_at, status, sub_totalht, discount_amount, ht_after_discount, tax_amount, totalttc, amount_remaining, promo_code) VALUES
(1, '2024-11-25 14:00:00', 'PENDING', 2500.00, 0.00, 2500.00, 500.00, 3000.00, 1500.00, NULL);

-- 6. INSERT ORDER ITEMS
-- Items for Order 1 (2 Laptops)
INSERT INTO order_item (order_id, product_id, quantity, unit_price, line_total) VALUES
(1, 1, 2, 8500.00, 17000.00);

-- Items for Order 2 (1 Printer)
INSERT INTO order_item (order_id, product_id, quantity, unit_price, line_total) VALUES
(2, 4, 1, 2500.00, 2500.00);

-- 7. INSERT PAYMENTS
-- Payment for Order 1 (Full payment by Check)
INSERT INTO payment (order_id, payment_number, amount, payment_type, payment_date, encashment_date, due_date, status, reference, bank) VALUES
(1, 1, 20400.00, 'CHEQUE', '2024-11-20', '2024-11-21', '2024-11-21', 'ENCAISSE', 'CHQ-998877', 'Banque Populaire');

-- Payment for Order 2 (Partial payment by Cash)
INSERT INTO payment (order_id, payment_number, amount, payment_type, payment_date, status, reference) VALUES
(2, 1, 1500.00, 'ESPECES', '2024-11-25', 'EN_ATTENTE', 'REC-001');
-- Seed data migration
-- Created: 2025-01-08
-- Description: Insert initial seed data for DiveSeeks application

-- Insert default super admin user
-- Password: 'admin123' (hashed with bcrypt)
INSERT INTO users (
  id,
  email,
  password_hash,
  first_name,
  last_name,
  role,
  status,
  email_verified_at,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'admin@diveseeks.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
  'Super',
  'Admin',
  'super_admin',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert sample broker user
INSERT INTO users (
  id,
  email,
  password_hash,
  first_name,
  last_name,
  phone,
  role,
  status,
  email_verified_at,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'broker@diveseeks.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
  'John',
  'Broker',
  '+1234567890',
  'broker',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert sample business owner user
INSERT INTO users (
  id,
  email,
  password_hash,
  first_name,
  last_name,
  phone,
  role,
  status,
  email_verified_at,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'owner@diveseeks.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
  'Jane',
  'Owner',
  '+1234567891',
  'business_owner',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert sample business
INSERT INTO businesses (
  id,
  owner_id,
  broker_id,
  name,
  business_type,
  description,
  phone,
  email,
  status,
  commission_rate,
  subscription_plan,
  subscription_expires_at,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  (SELECT id FROM users WHERE email = 'owner@diveseeks.com'),
  (SELECT id FROM users WHERE email = 'broker@diveseeks.com'),
  'Sample Restaurant',
  'restaurant',
  'A sample restaurant for testing purposes',
  '+1234567892',
  'restaurant@diveseeks.com',
  'active',
  2.50,
  'premium',
  CURRENT_TIMESTAMP + INTERVAL '1 year',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert sample branch
INSERT INTO branches (
  id,
  business_id,
  name,
  address,
  phone,
  email,
  manager_name,
  description,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  (SELECT id FROM businesses WHERE name = 'Sample Restaurant'),
  'Main Branch',
  '123 Main Street, City, State 12345',
  '+1234567893',
  'mainbranch@diveseeks.com',
  'Branch Manager',
  'Main branch of the sample restaurant',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (
  id,
  business_id,
  name,
  description,
  sort_order,
  created_at,
  updated_at
) VALUES 
(
  uuid_generate_v4(),
  (SELECT id FROM businesses WHERE name = 'Sample Restaurant'),
  'Appetizers',
  'Starter dishes and appetizers',
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  uuid_generate_v4(),
  (SELECT id FROM businesses WHERE name = 'Sample Restaurant'),
  'Main Courses',
  'Main course dishes',
  2,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  uuid_generate_v4(),
  (SELECT id FROM businesses WHERE name = 'Sample Restaurant'),
  'Beverages',
  'Drinks and beverages',
  3,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (
  id,
  branch_id,
  category_id,
  name,
  description,
  sku,
  price,
  cost,
  created_at,
  updated_at
) VALUES 
(
  uuid_generate_v4(),
  (SELECT id FROM branches WHERE name = 'Main Branch'),
  (SELECT id FROM categories WHERE name = 'Appetizers'),
  'Caesar Salad',
  'Fresh romaine lettuce with caesar dressing',
  'APP001',
  12.99,
  6.50,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  uuid_generate_v4(),
  (SELECT id FROM branches WHERE name = 'Main Branch'),
  (SELECT id FROM categories WHERE name = 'Main Courses'),
  'Grilled Chicken',
  'Grilled chicken breast with vegetables',
  'MAIN001',
  18.99,
  9.50,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  uuid_generate_v4(),
  (SELECT id FROM branches WHERE name = 'Main Branch'),
  (SELECT id FROM categories WHERE name = 'Beverages'),
  'Coca Cola',
  'Classic Coca Cola soft drink',
  'BEV001',
  2.99,
  1.50,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert sample inventory
INSERT INTO inventory (
  id,
  product_id,
  branch_id,
  quantity,
  min_stock_level,
  reorder_point,
  unit_cost,
  created_at,
  updated_at
) VALUES 
(
  uuid_generate_v4(),
  (SELECT id FROM products WHERE sku = 'APP001'),
  (SELECT id FROM branches WHERE name = 'Main Branch'),
  50,
  10,
  15,
  6.50,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  uuid_generate_v4(),
  (SELECT id FROM products WHERE sku = 'MAIN001'),
  (SELECT id FROM branches WHERE name = 'Main Branch'),
  30,
  5,
  10,
  9.50,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  uuid_generate_v4(),
  (SELECT id FROM products WHERE sku = 'BEV001'),
  (SELECT id FROM branches WHERE name = 'Main Branch'),
  100,
  20,
  25,
  1.50,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert sample customer
INSERT INTO customers (
  id,
  business_id,
  first_name,
  last_name,
  email,
  phone,
  address,
  loyalty_points,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  (SELECT id FROM businesses WHERE name = 'Sample Restaurant'),
  'John',
  'Customer',
  'customer@example.com',
  '+1234567894',
  '456 Customer Street, City, State 12345',
  100,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
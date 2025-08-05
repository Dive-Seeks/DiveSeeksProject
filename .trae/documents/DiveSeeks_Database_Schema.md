# DiveSeeks Ltd Database Schema - Layer 1

## 1. Database Overview

### 1.1 Database Configuration

* **Database Engine**: PostgreSQL 14+

* **Character Set**: UTF8

* **Collation**: en\_US.UTF8

* **Timezone**: UTC

* **Connection Pooling**: PgBouncer recommended

### 1.2 Multi-Tenant Strategy

* **Approach**: Shared database with row-level security (RLS)

* **Tenant Isolation**: Business-based tenancy with branch-level permissions

* **Security**: PostgreSQL RLS policies for data isolation

### 1.3 Schema Structure

```sql
-- Create schemas for organization
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS business;
CREATE SCHEMA IF NOT EXISTS operations;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS system;
```

## 2. Core Enums and Types

### 2.1 User and Role Types

```sql
-- User roles enum
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'broker',
    'business_owner',
    'branch_manager',
    'cashier',
    'kitchen_staff',
    'delivery_driver',
    'inventory_manager'
);

-- User status enum
CREATE TYPE user_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'pending_verification'
);
```

### 2.2 Business Types

```sql
-- Business type enum
CREATE TYPE business_type AS ENUM (
    'restaurant',
    'retail',
    'service'
);

-- Business status enum
CREATE TYPE business_status AS ENUM (
    'pending',
    'active',
    'suspended',
    'closed'
);
```

### 2.3 Order and Transaction Types

```sql
-- Order status enum
CREATE TYPE order_status AS ENUM (
    'pending',
    'accepted',
    'preparing',
    'ready',
    'out_for_delivery',
    'completed',
    'cancelled'
);

-- Order type enum
CREATE TYPE order_type AS ENUM (
    'dine_in',
    'takeaway',
    'delivery',
    'online'
);

-- Payment method enum
CREATE TYPE payment_method AS ENUM (
    'cash',
    'card',
    'digital_wallet',
    'store_credit',
    'bank_transfer'
);

-- Transaction status enum
CREATE TYPE transaction_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded',
    'cancelled'
);

-- Transaction type enum
CREATE TYPE transaction_type AS ENUM (
    'sale',
    'refund',
    'commission',
    'payout',
    'adjustment'
);
```

### 2.4 Inventory and Stock Types

```sql
-- Stock status enum
CREATE TYPE stock_status AS ENUM (
    'in_stock',
    'low_stock',
    'out_of_stock',
    'discontinued'
);

-- Cart status enum
CREATE TYPE cart_status AS ENUM (
    'active',
    'held',
    'completed',
    'cancelled'
);

-- Notification type enum
CREATE TYPE notification_type AS ENUM (
    'order_received',
    'order_status_change',
    'low_stock',
    'payment_received',
    'system_alert',
    'user_action'
);

-- Notification channel enum
CREATE TYPE notification_channel AS ENUM (
    'in_app',
    'email',
    'sms',
    'push'
);
```

## 3. Authentication Schema (auth)

### 3.1 Users Table

```sql
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    role user_role NOT NULL,
    status user_status DEFAULT 'pending_verification',
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_role ON auth.users(role);
CREATE INDEX idx_users_status ON auth.users(status);
CREATE INDEX idx_users_created_at ON auth.users(created_at);
```

### 3.2 User Sessions Table

```sql
CREATE TABLE auth.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_sessions_user_id ON auth.user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON auth.user_sessions(expires_at);
CREATE INDEX idx_user_sessions_refresh_token ON auth.user_sessions(refresh_token_hash);
```

### 3.3 Password Reset Tokens

```sql
CREATE TABLE auth.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_password_reset_user_id ON auth.password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_expires_at ON auth.password_reset_tokens(expires_at);
```

## 4. Business Schema (business)

### 4.1 Businesses Table

```sql
CREATE TABLE business.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    business_type business_type NOT NULL,
    status business_status DEFAULT 'pending',
    broker_id UUID NOT NULL REFERENCES auth.users(id),
    owner_id UUID NOT NULL REFERENCES auth.users(id),
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    description TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_businesses_broker_id ON business.businesses(broker_id);
CREATE INDEX idx_businesses_owner_id ON business.businesses(owner_id);
CREATE INDEX idx_businesses_type ON business.businesses(business_type);
CREATE INDEX idx_businesses_status ON business.businesses(status);
CREATE INDEX idx_businesses_created_at ON business.businesses(created_at);
```

### 4.2 Branches Table

```sql
CREATE TABLE business.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business.businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address JSONB NOT NULL, -- {street, city, state, postal_code, country, latitude, longitude}
    phone VARCHAR(20),
    email VARCHAR(255),
    is_operational BOOLEAN DEFAULT false,
    operating_hours JSONB, -- {monday: {is_open, open_time, close_time}, ...}
    delivery_zones JSONB, -- Array of delivery zone objects
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_branches_business_id ON business.branches(business_id);
CREATE INDEX idx_branches_operational ON business.branches(is_operational);
CREATE INDEX idx_branches_created_at ON business.branches(created_at);
```

### 4.3 User Business Permissions

```sql
CREATE TABLE business.user_business_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES business.businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES business.branches(id) ON DELETE CASCADE,
    permissions JSONB NOT NULL, -- Array of permission strings
    granted_by UUID NOT NULL REFERENCES auth.users(id),
    granted_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, business_id, branch_id)
);

-- Indexes
CREATE INDEX idx_user_business_permissions_user_id ON business.user_business_permissions(user_id);
CREATE INDEX idx_user_business_permissions_business_id ON business.user_business_permissions(business_id);
CREATE INDEX idx_user_business_permissions_branch_id ON business.user_business_permissions(branch_id);
```

### 4.4 Categories Table

```sql
CREATE TABLE business.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business.businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES business.categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_categories_business_id ON business.categories(business_id);
CREATE INDEX idx_categories_parent_id ON business.categories(parent_id);
CREATE INDEX idx_categories_active ON business.categories(is_active);
```

## 5. Operations Schema (operations)

### 5.1 Products Table

```sql
CREATE TABLE operations.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business.businesses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES business.categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    image_urls JSONB DEFAULT '[]',
    modifiers JSONB DEFAULT '[]', -- Array of modifier objects
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_business_id ON operations.products(business_id);
CREATE INDEX idx_products_category_id ON operations.products(category_id);
CREATE INDEX idx_products_sku ON operations.products(sku);
CREATE INDEX idx_products_barcode ON operations.products(barcode);
CREATE INDEX idx_products_active ON operations.products(is_active);
CREATE INDEX idx_products_name_search ON operations.products USING gin(to_tsvector('english', name));
```

### 5.2 Branch Inventory Table

```sql
CREATE TABLE operations.branch_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES business.branches(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES operations.products(id) ON DELETE CASCADE,
    current_stock INTEGER NOT NULL DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    maximum_stock INTEGER,
    stock_status stock_status DEFAULT 'in_stock',
    last_restocked TIMESTAMP,
    cost_per_unit DECIMAL(10,2),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(branch_id, product_id)
);

-- Indexes
CREATE INDEX idx_branch_inventory_branch_id ON operations.branch_inventory(branch_id);
CREATE INDEX idx_branch_inventory_product_id ON operations.branch_inventory(product_id);
CREATE INDEX idx_branch_inventory_stock_status ON operations.branch_inventory(stock_status);
CREATE INDEX idx_branch_inventory_low_stock ON operations.branch_inventory(branch_id, stock_status) WHERE stock_status IN ('low_stock', 'out_of_stock');
```

### 5.3 Stock Movements Table

```sql
CREATE TABLE operations.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES business.branches(id),
    product_id UUID NOT NULL REFERENCES operations.products(id),
    movement_type VARCHAR(50) NOT NULL, -- 'restock', 'sale', 'waste', 'transfer', 'adjustment'
    quantity_change INTEGER NOT NULL, -- Positive for increase, negative for decrease
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    reason TEXT,
    reference_number VARCHAR(100),
    reference_id UUID, -- Could reference order_id, transfer_id, etc.
    performed_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stock_movements_branch_id ON operations.stock_movements(branch_id);
CREATE INDEX idx_stock_movements_product_id ON operations.stock_movements(product_id);
CREATE INDEX idx_stock_movements_type ON operations.stock_movements(movement_type);
CREATE INDEX idx_stock_movements_created_at ON operations.stock_movements(created_at);
CREATE INDEX idx_stock_movements_reference ON operations.stock_movements(reference_id);
```

### 5.4 Customers Table

```sql
CREATE TABLE operations.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business.businesses(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    addresses JSONB DEFAULT '[]', -- Array of address objects
    preferences JSONB DEFAULT '{}',
    loyalty_points INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    last_order_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_customers_business_id ON operations.customers(business_id);
CREATE INDEX idx_customers_email ON operations.customers(email);
CREATE INDEX idx_customers_phone ON operations.customers(phone);
CREATE INDEX idx_customers_name_search ON operations.customers USING gin(to_tsvector('english', first_name || ' ' || last_name));
```

### 5.5 Orders Table

```sql
CREATE TABLE operations.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    branch_id UUID NOT NULL REFERENCES business.branches(id),
    customer_id UUID REFERENCES operations.customers(id),
    order_type order_type NOT NULL,
    status order_status DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address JSONB,
    delivery_driver_id UUID REFERENCES auth.users(id),
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    special_instructions TEXT,
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_branch_id ON operations.orders(branch_id);
CREATE INDEX idx_orders_customer_id ON operations.orders(customer_id);
CREATE INDEX idx_orders_status ON operations.orders(status);
CREATE INDEX idx_orders_type ON operations.orders(order_type);
CREATE INDEX idx_orders_created_at ON operations.orders(created_at);
CREATE INDEX idx_orders_driver_id ON operations.orders(delivery_driver_id);
CREATE UNIQUE INDEX idx_orders_number ON operations.orders(order_number);
```

### 5.6 Order Items Table

```sql
CREATE TABLE operations.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES operations.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES operations.products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    modifiers JSONB DEFAULT '[]',
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON operations.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON operations.order_items(product_id);
```

### 5.7 Order Status History

```sql
CREATE TABLE operations.order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES operations.orders(id) ON DELETE CASCADE,
    previous_status order_status,
    new_status order_status NOT NULL,
    notes TEXT,
    changed_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_status_history_order_id ON operations.order_status_history(order_id);
CREATE INDEX idx_order_status_history_created_at ON operations.order_status_history(created_at);
```

### 5.8 POS Carts Table

```sql
CREATE TABLE operations.pos_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES business.branches(id),
    cashier_id UUID NOT NULL REFERENCES auth.users(id),
    cart_number VARCHAR(50) NOT NULL,
    status cart_status DEFAULT 'active',
    customer_id UUID REFERENCES operations.customers(id),
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    held_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pos_carts_branch_id ON operations.pos_carts(branch_id);
CREATE INDEX idx_pos_carts_cashier_id ON operations.pos_carts(cashier_id);
CREATE INDEX idx_pos_carts_status ON operations.pos_carts(status);
CREATE INDEX idx_pos_carts_created_at ON operations.pos_carts(created_at);
```

### 5.9 POS Cart Items Table

```sql
CREATE TABLE operations.pos_cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES operations.pos_carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES operations.products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    modifiers JSONB DEFAULT '[]',
    added_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pos_cart_items_cart_id ON operations.pos_cart_items(cart_id);
CREATE INDEX idx_pos_cart_items_product_id ON operations.pos_cart_items(product_id);
```

## 6. Finance Schema (finance)

### 6.1 Transactions Table

```sql
CREATE TABLE finance.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES business.branches(id),
    order_id UUID REFERENCES operations.orders(id),
    transaction_type transaction_type NOT NULL,
    payment_method payment_method NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) DEFAULT 0,
    status transaction_status DEFAULT 'pending',
    currency VARCHAR(3) DEFAULT 'USD',
    exchange_rate DECIMAL(10,4) DEFAULT 1.0000,
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    reference_number VARCHAR(100),
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}',
    processed_by UUID REFERENCES auth.users(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_branch_id ON finance.transactions(branch_id);
CREATE INDEX idx_transactions_order_id ON finance.transactions(order_id);
CREATE INDEX idx_transactions_status ON finance.transactions(status);
CREATE INDEX idx_transactions_type ON finance.transactions(transaction_type);
CREATE INDEX idx_transactions_payment_method ON finance.transactions(payment_method);
CREATE INDEX idx_transactions_created_at ON finance.transactions(created_at);
CREATE INDEX idx_transactions_stripe_intent ON finance.transactions(stripe_payment_intent_id);
```

### 6.2 Daily Reports Table

```sql
CREATE TABLE finance.daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES business.branches(id),
    report_date DATE NOT NULL,
    total_sales DECIMAL(10,2) DEFAULT 0,
    total_cash DECIMAL(10,2) DEFAULT 0,
    total_card DECIMAL(10,2) DEFAULT 0,
    total_digital_wallet DECIMAL(10,2) DEFAULT 0,
    total_commission DECIMAL(10,2) DEFAULT 0,
    total_tax DECIMAL(10,2) DEFAULT 0,
    total_discounts DECIMAL(10,2) DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_count INTEGER DEFAULT 0,
    generated_by UUID REFERENCES auth.users(id),
    generated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(branch_id, report_date)
);

-- Indexes
CREATE INDEX idx_daily_reports_branch_id ON finance.daily_reports(branch_id);
CREATE INDEX idx_daily_reports_date ON finance.daily_reports(report_date);
CREATE UNIQUE INDEX idx_daily_reports_branch_date ON finance.daily_reports(branch_id, report_date);
```

### 6.3 Commission Tracking Table

```sql
CREATE TABLE finance.commission_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES business.businesses(id),
    broker_id UUID NOT NULL REFERENCES auth.users(id),
    transaction_id UUID NOT NULL REFERENCES finance.transactions(id),
    commission_rate DECIMAL(5,4) NOT NULL, -- e.g., 0.0250 for 2.5%
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_type VARCHAR(50) NOT NULL, -- 'transaction', 'monthly', 'setup'
    period_start DATE,
    period_end DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'calculated', 'paid'
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_commission_tracking_business_id ON finance.commission_tracking(business_id);
CREATE INDEX idx_commission_tracking_broker_id ON finance.commission_tracking(broker_id);
CREATE INDEX idx_commission_tracking_transaction_id ON finance.commission_tracking(transaction_id);
CREATE INDEX idx_commission_tracking_status ON finance.commission_tracking(status);
```

## 7. System Schema (system)

### 7.1 Notifications Table

```sql
CREATE TABLE system.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES business.businesses(id),
    branch_id UUID REFERENCES business.branches(id),
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    channels notification_channel[] DEFAULT '{in_app}',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    sent_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON system.notifications(user_id);
CREATE INDEX idx_notifications_business_id ON system.notifications(business_id);
CREATE INDEX idx_notifications_branch_id ON system.notifications(branch_id);
CREATE INDEX idx_notifications_type ON system.notifications(type);
CREATE INDEX idx_notifications_read ON system.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON system.notifications(created_at);
```

### 7.2 Audit Logs Table

```sql
CREATE TABLE system.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    business_id UUID REFERENCES business.businesses(id),
    branch_id UUID REFERENCES business.branches(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON system.audit_logs(user_id);
CREATE INDEX idx_audit_logs_business_id ON system.audit_logs(business_id);
CREATE INDEX idx_audit_logs_branch_id ON system.audit_logs(branch_id);
CREATE INDEX idx_audit_logs_action ON system.audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON system.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON system.audit_logs(created_at);
```

### 7.3 System Settings Table

```sql
CREATE TABLE system.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_settings_key ON system.settings(key);
CREATE INDEX idx_settings_public ON system.settings(is_public);
```

### 7.4 File Uploads Table

```sql
CREATE TABLE system.file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    business_id UUID REFERENCES business.businesses(id),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64),
    upload_purpose VARCHAR(50), -- 'product_image', 'logo', 'document', etc.
    is_public BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_file_uploads_user_id ON system.file_uploads(user_id);
CREATE INDEX idx_file_uploads_business_id ON system.file_uploads(business_id);
CREATE INDEX idx_file_uploads_purpose ON system.file_uploads(upload_purpose);
CREATE INDEX idx_file_uploads_hash ON system.file_uploads(file_hash);
```

## 8. Row Level Security (RLS) Policies

### 8.1 Enable RLS on Tables

```sql
-- Enable RLS on all business-related tables
ALTER TABLE business.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE business.user_business_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business.categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE operations.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.branch_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.pos_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.pos_cart_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE finance.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.commission_tracking ENABLE ROW LEVEL SECURITY;

ALTER TABLE system.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system.audit_logs ENABLE ROW LEVEL SECURITY;
```

### 8.2 Business Access Policies

```sql
-- Business access policy
CREATE POLICY business_access_policy ON business.businesses
    FOR ALL
    TO authenticated
    USING (
        -- Super admins can access all businesses
        EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'super_admin')
        OR
        -- Brokers can access businesses they manage
        broker_id = auth.uid()
        OR
        -- Business owners can access their businesses
        owner_id = auth.uid()
        OR
        -- Staff can access businesses they have permissions for
        EXISTS (
            SELECT 1 FROM business.user_business_permissions ubp
            WHERE ubp.user_id = auth.uid() 
            AND ubp.business_id = id 
            AND ubp.is_active = true
        )
    );

-- Branch access policy
CREATE POLICY branch_access_policy ON business.branches
    FOR ALL
    TO authenticated
    USING (
        -- Super admins can access all branches
        EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'super_admin')
        OR
        -- Business owners and brokers can access branches of their businesses
        EXISTS (
            SELECT 1 FROM business.businesses b
            WHERE b.id = business_id
            AND (b.owner_id = auth.uid() OR b.broker_id = auth.uid())
        )
        OR
        -- Staff can access branches they have permissions for
        EXISTS (
            SELECT 1 FROM business.user_business_permissions ubp
            WHERE ubp.user_id = auth.uid()
            AND ubp.business_id = business_id
            AND (ubp.branch_id IS NULL OR ubp.branch_id = id)
            AND ubp.is_active = true
        )
    );
```

### 8.3 Order Access Policies

```sql
-- Orders access policy
CREATE POLICY orders_access_policy ON operations.orders
    FOR ALL
    TO authenticated
    USING (
        -- Super admins can access all orders
        EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'super_admin')
        OR
        -- Users can access orders from branches they have access to
        EXISTS (
            SELECT 1 FROM business.branches br
            JOIN business.businesses b ON b.id = br.business_id
            WHERE br.id = branch_id
            AND (
                b.owner_id = auth.uid()
                OR b.broker_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM business.user_business_permissions ubp
                    WHERE ubp.user_id = auth.uid()
                    AND ubp.business_id = b.id
                    AND (ubp.branch_id IS NULL OR ubp.branch_id = br.id)
                    AND ubp.is_active = true
                )
            )
        )
    );
```

## 9. Database Functions and Triggers

### 9.1 Updated At Trigger Function

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON business.businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON business.branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for other tables with updated_at columns
```

### 9.2 Stock Update Trigger

```sql
-- Function to update stock status based on current stock
CREATE OR REPLACE FUNCTION update_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update stock status based on current stock levels
    IF NEW.current_stock <= 0 THEN
        NEW.stock_status = 'out_of_stock';
    ELSIF NEW.current_stock <= NEW.minimum_stock THEN
        NEW.stock_status = 'low_stock';
    ELSE
        NEW.stock_status = 'in_stock';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to branch_inventory table
CREATE TRIGGER update_inventory_stock_status 
    BEFORE INSERT OR UPDATE ON operations.branch_inventory
    FOR EACH ROW EXECUTE FUNCTION update_stock_status();
```

### 9.3 Order Number Generation Function

```sql
-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION generate_order_number(branch_id UUID)
RETURNS VARCHAR(50) AS $$
DECLARE
    branch_code VARCHAR(10);
    order_count INTEGER;
    order_number VARCHAR(50);
BEGIN
    -- Get branch code (first 3 characters of branch name + branch id first 3 chars)
    SELECT UPPER(LEFT(name, 3)) || LEFT(REPLACE(id::text, '-', ''), 3)
    INTO branch_code
    FROM business.branches
    WHERE id = branch_id;
    
    -- Get today's order count for this branch
    SELECT COUNT(*) + 1
    INTO order_count
    FROM operations.orders
    WHERE branch_id = generate_order_number.branch_id
    AND DATE(created_at) = CURRENT_DATE;
    
    -- Generate order number: BRANCHCODE-YYYYMMDD-NNNN
    order_number := branch_code || '-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(order_count::text, 4, '0');
    
    RETURN order_number;
END;
$$ language 'plpgsql';
```

## 10. Initial Data and Seed Scripts

### 10.1 System Settings

```sql
-- Insert default system settings
INSERT INTO system.settings (key, value, description, is_public) VALUES
('app_name', '"DiveSeeks Ltd"', 'Application name', true),
('app_version', '"1.0.0"', 'Application version', true),
('default_currency', '"USD"', 'Default currency code', true),
('default_tax_rate', '0.08', 'Default tax rate (8%)', false),
('max_file_upload_size', '10485760', 'Max file upload size in bytes (10MB)', false),
('allowed_file_types', '["image/jpeg", "image/png", "image/gif", "application/pdf"]', 'Allowed file MIME types', false),
('session_timeout', '3600', 'Session timeout in seconds (1 hour)', false),
('password_min_length', '8', 'Minimum password length', false),
('max_login_attempts', '5', 'Maximum failed login attempts before lockout', false),
('lockout_duration', '900', 'Account lockout duration in seconds (15 minutes)', false);
```

### 10.2 Default Super Admin User

```sql
-- Create default super admin user (password should be changed immediately)
INSERT INTO auth.users (email, password_hash, first_name, last_name, role, status, email_verified_at)
VALUES (
    'admin@diveseeks.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', -- 'admin123' - CHANGE THIS!
    'System',
    'Administrator',
    'super_admin',
    'active',
    NOW()
);
```

## 11. Performance Optimization

### 11.1 Additional Indexes for Performance

```sql
-- Composite indexes for common queries
CREATE INDEX idx_orders_branch_status_created ON operations.orders(branch_id, status, created_at);
CREATE INDEX idx_orders_customer_created ON operations.orders(customer_id, created_at DESC);
CREATE INDEX idx_transactions_branch_date ON finance.transactions(branch_id, DATE(created_at));
CREATE INDEX idx_inventory_branch_status ON operations.branch_inventory(branch_id, stock_status);
CREATE INDEX idx_notifications_user_read_created ON system.notifications(user_id, is_read, created_at DESC);

-- Partial indexes for active records
CREATE INDEX idx_products_active_business ON operations.products(business_id) WHERE is_active = true;
CREATE INDEX idx_users_active_role ON auth.users(role) WHERE status = 'active';
CREATE INDEX idx_branches_operational ON business.branches(business_id) WHERE is_operational = true;
```

### 11.2 Database Maintenance

```sql
-- Create function for cleaning up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Clean up expired password reset tokens
    DELETE FROM auth.password_reset_tokens WHERE expires_at < NOW() - INTERVAL '1 day';
    
    -- Clean up expired user sessions
    DELETE FROM auth.user_sessions WHERE expires_at < NOW();
    
    -- Clean up old audit logs (keep 1 year)
    DELETE FROM system.audit_logs WHERE created_at < NOW() - INTERVAL '1 year';
    
    -- Clean up read notifications older than 30 days
    DELETE FROM system.notifications 
    WHERE is_read = true AND created_at < NOW() - INTERVAL '30 days';
    
    -- Update table statistics
    ANALYZE;
END;
$$ language 'plpgsql';
```


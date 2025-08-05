# DiveSeeks Ltd API Specifications - Layer 1

## 1. API Overview

### 1.1 Base Configuration

* **Base URL**: `https://api.diveseeks.com/v1`

* **Protocol**: HTTPS only

* **Content Type**: `application/json`

* **Authentication**: JWT Bearer tokens

* **Rate Limiting**: 1000 requests per hour per user

### 1.2 Standard Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp?: string;
  };
}
```

### 1.3 Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  errors: string[];
  code: string;
  timestamp: string;
}
```

## 2. Authentication Module API

### 2.1 User Authentication

#### POST /auth/login

**Description**: Authenticate user and return JWT tokens

**Request Body**:

```typescript
interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}
```

**Response**:

```typescript
interface LoginResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    businesses: BusinessSummary[];
    branches: BranchSummary[];
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}
```

#### POST /auth/refresh

**Description**: Refresh access token using refresh token

**Request Body**:

```typescript
interface RefreshRequest {
  refresh_token: string;
}
```

**Response**:

```typescript
interface RefreshResponse {
  access_token: string;
  expires_in: number;
}
```

#### POST /auth/logout

**Description**: Invalidate user session and tokens

**Headers**: `Authorization: Bearer <access_token>`

**Response**: `{ success: true, message: "Logged out successfully" }`

### 2.2 Password Management

#### POST /auth/forgot-password

**Request Body**:

```typescript
interface ForgotPasswordRequest {
  email: string;
}
```

#### POST /auth/reset-password

**Request Body**:

```typescript
interface ResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}
```

## 3. User Management Module API

### 3.1 User Operations

#### GET /users/profile

**Description**: Get current user profile
**Headers**: `Authorization: Bearer <access_token>`

**Response**:

```typescript
interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  businesses: BusinessSummary[];
  branches: BranchSummary[];
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}
```

#### PUT /users/profile

**Description**: Update user profile

**Request Body**:

```typescript
interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
}
```

#### GET /users/business/{businessId}

**Description**: Get users within a business (Business Owner+ only)

**Query Parameters**:

* `page?: number` (default: 1)

* `limit?: number` (default: 20)

* `role?: UserRole`

* `branch_id?: string`

#### POST /users/business/{businessId}

**Description**: Create new user for business

**Request Body**:

```typescript
interface CreateUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  branch_ids?: string[];
  permissions?: Permission[];
  temporary_password?: boolean;
}
```

## 4. Business Management Module API

### 4.1 Business Operations

#### GET /businesses

**Description**: Get businesses (filtered by user role)

**Query Parameters**:

* `page?: number`

* `limit?: number`

* `status?: BusinessStatus`

* `type?: BusinessType`

**Response**:

```typescript
interface BusinessListResponse {
  businesses: Business[];
  meta: PaginationMeta;
}

interface Business {
  id: string;
  name: string;
  business_type: BusinessType;
  status: BusinessStatus;
  broker: UserSummary;
  owner: UserSummary;
  registration_number?: string;
  logo_url?: string;
  branch_count: number;
  created_at: string;
  updated_at: string;
}
```

#### POST /businesses

**Description**: Create new business (Broker+ only)

**Request Body**:

```typescript
interface CreateBusinessRequest {
  name: string;
  business_type: BusinessType;
  owner_email: string;
  owner_first_name: string;
  owner_last_name: string;
  registration_number?: string;
  tax_id?: string;
  logo_url?: string;
  initial_branch: {
    name: string;
    address: Address;
    phone?: string;
    email?: string;
  };
}
```

#### GET /businesses/{businessId}

**Description**: Get business details

**Response**:

```typescript
interface BusinessDetails extends Business {
  branches: BranchSummary[];
  staff_count: number;
  monthly_revenue: number;
  settings: BusinessSettings;
}
```

#### PUT /businesses/{businessId}

**Description**: Update business information

#### DELETE /businesses/{businessId}

**Description**: Deactivate business (Super Admin only)

### 4.2 Branch Operations

#### GET /businesses/{businessId}/branches

**Description**: Get branches for business

#### POST /businesses/{businessId}/branches

**Description**: Create new branch

**Request Body**:

```typescript
interface CreateBranchRequest {
  name: string;
  address: Address;
  phone?: string;
  email?: string;
  operating_hours: OperatingHours;
  delivery_zones?: DeliveryZone[];
}

interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

interface DayHours {
  is_open: boolean;
  open_time?: string; // "09:00"
  close_time?: string; // "22:00"
}
```

#### GET /branches/{branchId}

**Description**: Get branch details

#### PUT /branches/{branchId}

**Description**: Update branch information

#### PUT /branches/{branchId}/status

**Description**: Update operational status

**Request Body**:

```typescript
interface UpdateBranchStatusRequest {
  is_operational: boolean;
  reason?: string;
}
```

## 5. Ordering System Module API

### 5.1 Order Management

#### GET /orders

**Description**: Get orders (filtered by user permissions)

**Query Parameters**:

* `branch_id?: string`

* `status?: OrderStatus`

* `order_type?: OrderType`

* `date_from?: string`

* `date_to?: string`

* `page?: number`

* `limit?: number`

**Response**:

```typescript
interface OrderListResponse {
  orders: OrderSummary[];
  meta: PaginationMeta;
}

interface OrderSummary {
  id: string;
  order_number: string;
  branch: BranchSummary;
  customer: CustomerSummary;
  order_type: OrderType;
  status: OrderStatus;
  total_amount: number;
  item_count: number;
  created_at: string;
  estimated_delivery_time?: string;
}
```

#### POST /orders

**Description**: Create new order

**Request Body**:

```typescript
interface CreateOrderRequest {
  branch_id: string;
  customer_id?: string;
  order_type: OrderType;
  items: OrderItemRequest[];
  delivery_address?: Address;
  special_instructions?: string;
  payment_method?: PaymentMethod;
}

interface OrderItemRequest {
  product_id: string;
  quantity: number;
  modifiers?: ProductModifier[];
  special_instructions?: string;
}
```

#### GET /orders/{orderId}

**Description**: Get order details

**Response**:

```typescript
interface OrderDetails {
  id: string;
  order_number: string;
  branch: BranchDetails;
  customer: CustomerDetails;
  order_type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  delivery_address?: Address;
  delivery_driver?: UserSummary;
  estimated_delivery_time?: string;
  status_history: OrderStatusHistory[];
  created_at: string;
  updated_at: string;
}
```

#### PUT /orders/{orderId}/status

**Description**: Update order status

**Request Body**:

```typescript
interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
  estimated_time?: string;
}
```

#### PUT /orders/{orderId}/assign-driver

**Description**: Assign delivery driver

**Request Body**:

```typescript
interface AssignDriverRequest {
  driver_id: string;
  estimated_delivery_time?: string;
}
```

### 5.2 Customer Management

#### GET /customers

**Description**: Get customers for business

#### POST /customers

**Description**: Create new customer

**Request Body**:

```typescript
interface CreateCustomerRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  addresses?: Address[];
}
```

## 6. Inventory Management Module API

### 6.1 Product Management

#### GET /products

**Description**: Get products for business

**Query Parameters**:

* `business_id: string`

* `category_id?: string`

* `is_active?: boolean`

* `search?: string`

* `page?: number`

* `limit?: number`

**Response**:

```typescript
interface ProductListResponse {
  products: Product[];
  meta: PaginationMeta;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  category: CategorySummary;
  sku?: string;
  barcode?: string;
  price: number;
  cost_price?: number;
  image_urls: string[];
  is_active: boolean;
  branch_availability: BranchStock[];
  created_at: string;
  updated_at: string;
}
```

#### POST /products

**Description**: Create new product

**Request Body**:

```typescript
interface CreateProductRequest {
  name: string;
  description?: string;
  category_id: string;
  sku?: string;
  barcode?: string;
  price: number;
  cost_price?: number;
  image_urls?: string[];
  initial_stock?: BranchStockInput[];
}
```

#### GET /products/{productId}

**Description**: Get product details

#### PUT /products/{productId}

**Description**: Update product

#### DELETE /products/{productId}

**Description**: Deactivate product

### 6.2 Inventory Operations

#### GET /inventory/branch/{branchId}

**Description**: Get inventory for specific branch

**Response**:

```typescript
interface BranchInventoryResponse {
  branch: BranchSummary;
  inventory: BranchStock[];
  low_stock_count: number;
  out_of_stock_count: number;
}

interface BranchStock {
  product: ProductSummary;
  current_stock: number;
  minimum_stock: number;
  maximum_stock?: number;
  stock_status: StockStatus;
  last_restocked?: string;
  updated_at: string;
}
```

#### PUT /inventory/branch/{branchId}/product/{productId}

**Description**: Update stock levels

**Request Body**:

```typescript
interface UpdateStockRequest {
  adjustment_type: 'restock' | 'sale' | 'waste' | 'transfer' | 'adjustment';
  quantity: number;
  reason?: string;
  reference_number?: string;
}
```

#### GET /inventory/movements

**Description**: Get stock movement history

**Query Parameters**:

* `branch_id?: string`

* `product_id?: string`

* `movement_type?: string`

* `date_from?: string`

* `date_to?: string`

## 7. POS System Module API

### 7.1 Cart Operations

#### POST /pos/carts

**Description**: Create new POS cart

**Request Body**:

```typescript
interface CreateCartRequest {
  branch_id: string;
  customer_id?: string;
}
```

**Response**:

```typescript
interface CartResponse {
  id: string;
  cart_number: string;
  branch: BranchSummary;
  cashier: UserSummary;
  status: CartStatus;
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  customer?: CustomerSummary;
  created_at: string;
  updated_at: string;
}
```

#### GET /pos/carts/{cartId}

**Description**: Get cart details

#### PUT /pos/carts/{cartId}/items

**Description**: Add/update cart items

**Request Body**:

```typescript
interface UpdateCartItemsRequest {
  items: CartItemUpdate[];
}

interface CartItemUpdate {
  product_id: string;
  quantity: number;
  modifiers?: ProductModifier[];
  discount_amount?: number;
}
```

#### DELETE /pos/carts/{cartId}/items/{itemId}

**Description**: Remove item from cart

#### PUT /pos/carts/{cartId}/hold

**Description**: Hold cart for later

#### PUT /pos/carts/{cartId}/resume

**Description**: Resume held cart

### 7.2 Checkout Operations

#### POST /pos/carts/{cartId}/checkout

**Description**: Process cart checkout

**Request Body**:

```typescript
interface CheckoutRequest {
  payments: PaymentInput[];
  customer_id?: string;
  discount?: DiscountInput;
  notes?: string;
}

interface PaymentInput {
  method: PaymentMethod;
  amount: number;
  reference?: string;
  card_last_four?: string;
}

interface DiscountInput {
  type: 'percentage' | 'fixed';
  value: number;
  reason?: string;
}
```

**Response**:

```typescript
interface CheckoutResponse {
  order: OrderDetails;
  receipt: ReceiptData;
  change_due?: number;
}
```

### 7.3 Product Lookup

#### GET /pos/products/search

**Description**: Search products for POS

**Query Parameters**:

* `branch_id: string`

* `query?: string` (name, SKU, or barcode)

* `category_id?: string`

* `limit?: number`

**Response**:

```typescript
interface POSProductSearchResponse {
  products: POSProduct[];
}

interface POSProduct {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  price: number;
  category: string;
  image_url?: string;
  current_stock: number;
  is_available: boolean;
}
```

## 8. Payment Processing Module API

### 8.1 Payment Operations

#### POST /payments/process

**Description**: Process payment (Stripe integration)

**Request Body**:

```typescript
interface ProcessPaymentRequest {
  amount: number;
  currency: string;
  payment_method: string;
  order_id?: string;
  customer_id?: string;
  metadata?: Record<string, string>;
}
```

#### GET /payments/transactions

**Description**: Get transaction history

**Query Parameters**:

* `branch_id?: string`

* `order_id?: string`

* `status?: TransactionStatus`

* `payment_method?: PaymentMethod`

* `date_from?: string`

* `date_to?: string`

#### POST /payments/refund

**Description**: Process refund

**Request Body**:

```typescript
interface RefundRequest {
  transaction_id: string;
  amount?: number; // partial refund if specified
  reason: string;
}
```

### 8.2 Financial Reports

#### GET /reports/daily/{branchId}

**Description**: Get daily sales report

**Query Parameters**:

* `date: string` (YYYY-MM-DD)

**Response**:

```typescript
interface DailyReportResponse {
  branch: BranchSummary;
  date: string;
  summary: {
    total_sales: number;
    total_orders: number;
    average_order_value: number;
    payment_breakdown: PaymentBreakdown;
  };
  hourly_sales: HourlySales[];
  top_products: ProductSales[];
}
```

#### GET /reports/z-report/{branchId}

**Description**: Generate Z report for end-of-day

## 9. Notification Module API

### 9.1 Notification Operations

#### GET /notifications

**Description**: Get user notifications

**Query Parameters**:

* `is_read?: boolean`

* `type?: NotificationType`

* `page?: number`

* `limit?: number`

#### PUT /notifications/{notificationId}/read

**Description**: Mark notification as read

#### PUT /notifications/mark-all-read

**Description**: Mark all notifications as read

#### POST /notifications/send

**Description**: Send notification (Admin only)

**Request Body**:

```typescript
interface SendNotificationRequest {
  user_ids?: string[];
  branch_ids?: string[];
  type: NotificationType;
  title: string;
  message: string;
  channels: NotificationChannel[];
  data?: Record<string, any>;
}
```

### 9.2 WebSocket Events

#### Connection

```typescript
// Connect to WebSocket
const socket = io('wss://api.diveseeks.com', {
  auth: {
    token: 'jwt_access_token'
  }
});
```

#### Event Types

```typescript
// Order events
socket.on('order:created', (data: OrderCreatedEvent) => {});
socket.on('order:status_changed', (data: OrderStatusChangedEvent) => {});

// Inventory events
socket.on('inventory:low_stock', (data: LowStockEvent) => {});
socket.on('inventory:out_of_stock', (data: OutOfStockEvent) => {});

// Payment events
socket.on('payment:received', (data: PaymentReceivedEvent) => {});

// System events
socket.on('system:alert', (data: SystemAlertEvent) => {});
```

## 10. Error Codes

### 10.1 Authentication Errors

* `AUTH_001`: Invalid credentials

* `AUTH_002`: Token expired

* `AUTH_003`: Token invalid

* `AUTH_004`: Insufficient permissions

* `AUTH_005`: Account suspended

### 10.2 Business Logic Errors

* `BIZ_001`: Business not found

* `BIZ_002`: Branch not found

* `BIZ_003`: Product not found

* `BIZ_004`: Insufficient stock

* `BIZ_005`: Order cannot be modified

* `BIZ_006`: Payment processing failed

### 10.3 Validation Errors

* `VAL_001`: Required field missing

* `VAL_002`: Invalid format

* `VAL_003`: Value out of range

* `VAL_004`: Duplicate entry

## 11. Rate Limiting

### 11.1 Limits by Endpoint Type

* **Authentication**: 10 requests per minute

* **Read Operations**: 1000 requests per hour

* **Write Operations**: 500 requests per hour

* **File Uploads**: 50 requests per hour

### 11.2 Rate Limit Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 12. Pagination

### 12.1 Standard Pagination

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
```

### 12.2 Cursor-

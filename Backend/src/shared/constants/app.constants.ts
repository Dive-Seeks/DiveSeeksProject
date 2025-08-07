export const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

  // JWT
  JWT_ACCESS_TOKEN_EXPIRY: '15m',
  JWT_REFRESH_TOKEN_EXPIRY: '7d',

  // Rate Limiting
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100,

  // Password
  MIN_PASSWORD_LENGTH: 8,
  BCRYPT_SALT_ROUNDS: 12,

  // Security
  SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    ACCOUNT_LOCK_DURATION: 30, // minutes
  },

  // JWT
  JWT: {
    ACCESS_TOKEN_EXPIRY: 3600, // seconds
    REFRESH_TOKEN_EXPIRY: 7, // days
  },

  // Business Rules
  MAX_BRANCHES_PER_BUSINESS: 50,
  MAX_PRODUCTS_PER_BRANCH: 1000,

  // Order Rules
  ORDER_TIMEOUT_MINUTES: 30,
  MAX_ORDER_ITEMS: 50,
};

export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',

  // Validation
  VALIDATION_FAILED: 'Validation failed',
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email format',
  WEAK_PASSWORD: 'Password is too weak',

  // Business Logic
  USER_NOT_FOUND: 'User not found',
  BUSINESS_NOT_FOUND: 'Business not found',
  BRANCH_NOT_FOUND: 'Branch not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  ORDER_NOT_FOUND: 'Order not found',

  // System
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
  FILE_UPLOAD_ERROR: 'File upload failed',
};

export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',

  // CRUD Operations
  CREATED_SUCCESS: 'Created successfully',
  UPDATED_SUCCESS: 'Updated successfully',
  DELETED_SUCCESS: 'Deleted successfully',
  RETRIEVED_SUCCESS: 'Retrieved successfully',

  // Business Operations
  ORDER_PLACED: 'Order placed successfully',
  PAYMENT_PROCESSED: 'Payment processed successfully',
  INVENTORY_UPDATED: 'Inventory updated successfully',
};

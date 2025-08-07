export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  BROKER = 'broker',
  BUSINESS_OWNER = 'business_owner',
  BRANCH_MANAGER = 'branch_manager',
  CASHIER = 'cashier',
  KITCHEN_STAFF = 'kitchen_staff',
  DELIVERY_DRIVER = 'delivery_driver',
  INVENTORY_MANAGER = 'inventory_manager',
  FINANCE_MANAGER = 'finance_manager',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

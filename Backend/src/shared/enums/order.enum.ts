export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACCEPTED = 'accepted',
  PREPARING = 'preparing',
  READY = 'ready',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum OrderType {
  DINE_IN = 'dine_in',
  TAKEAWAY = 'takeaway',
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  ONLINE = 'online',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  DIGITAL_WALLET = 'digital_wallet',
  STORE_CREDIT = 'store_credit',
  BANK_TRANSFER = 'bank_transfer',
}

export enum TransactionStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum TransactionType {
  CHARGE = 'charge',
  SALE = 'sale',
  REFUND = 'refund',
  COMMISSION = 'commission',
  PAYOUT = 'payout',
  ADJUSTMENT = 'adjustment',
}

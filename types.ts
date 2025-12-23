
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  address?: string;
  lastDeliveryDate?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  batchNumber: string;
  mfgDate: string;
  expiryDate: string;
  stockQuantity: number;
  wholesalePrice: number;
  retailPrice: number;
}

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED'
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  lastDeliveryDate?: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryCharge: number;
  status: OrderStatus;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  message: string;
  response?: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
}

export interface AppConfig {
  freeDeliveryThreshold: number;
  defaultDeliveryCharge: number;
  logoUrl: string;
}

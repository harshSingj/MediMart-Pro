
import { InventoryItem, UserRole, AppConfig } from './types';

export const APP_CONFIG: AppConfig = {
  freeDeliveryThreshold: 10000,
  defaultDeliveryCharge: 250,
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/822/822118.png' // Medical Plus Logo
};

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Analgesics',
    batchNumber: 'BT-0012',
    mfgDate: '2023-10-01',
    expiryDate: '2025-10-01',
    stockQuantity: 500,
    wholesalePrice: 12,
    retailPrice: 20
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    batchNumber: 'BT-0055',
    mfgDate: '2023-11-15',
    expiryDate: '2025-05-15',
    stockQuantity: 200,
    wholesalePrice: 45,
    retailPrice: 70
  },
  {
    id: '3',
    name: 'Vitamin C 500mg',
    category: 'Supplements',
    batchNumber: 'BT-0099',
    mfgDate: '2024-01-10',
    expiryDate: '2026-01-10',
    stockQuantity: 1000,
    wholesalePrice: 8,
    retailPrice: 15
  },
  {
    id: '4',
    name: 'Metformin 500mg',
    category: 'Antidiabetics',
    batchNumber: 'BT-0120',
    mfgDate: '2023-09-20',
    expiryDate: '2025-09-20',
    stockQuantity: 350,
    wholesalePrice: 18,
    retailPrice: 30
  },
  {
    id: '5',
    name: 'Atorvastatin 10mg',
    category: 'Cardiovascular',
    batchNumber: 'BT-0201',
    mfgDate: '2023-12-01',
    expiryDate: '2025-12-01',
    stockQuantity: 15, // Low stock example
    wholesalePrice: 25,
    retailPrice: 45
  }
];

export const CATEGORIES = [
  'Analgesics',
  'Antibiotics',
  'Antidiabetics',
  'Cardiovascular',
  'Supplements',
  'Dermatological',
  'Gastrointestinal'
];

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount?: number;
  stock: number;
  volume: string;
  description: string;
  notes: string;
  category: string;
  gender: string;
  image: string;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  customerInfo?: string;
}

export type OrderStatus = 'جديد' | 'قيد المعالجة' | 'تم التأكيد' | 'تم الشحن' | 'مكتمل' | 'ملغى';

export interface SiteSettings {
  whatsappNumber: string;
  storeName: string;
  storeDescription: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  deliveryInfo: string;
}

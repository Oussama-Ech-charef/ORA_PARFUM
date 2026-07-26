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

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

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
  workingDays?: string;
  workingHours?: string;
  weekendDay?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  logo?: string;
  favicon?: string;
  currency?: string;
  language?: string;
  orderWhatsappMessage?: string;
}

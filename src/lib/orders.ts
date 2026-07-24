import { Order, OrderStatus } from '@/types';

const ORDERS_KEY = 'ora_orders';

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return [];
}

export function saveOrders(orders: Order[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}

export function addOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
  }
}

export function getOrderById(orderId: string): Order | undefined {
  return getOrders().find((o) => o.id === orderId);
}

export function generateOrderId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORA-${y}${m}${d}-${rand}`;
}

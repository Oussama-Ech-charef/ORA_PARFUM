'use client';

import { Cart, CartItem, Product } from '@/types';
import { formatPrice } from '@/lib/format';

const CART_KEY = 'ora_cart';

export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], subtotal: 0, discount: 0, total: 0 };
  }
  try {
    const data = localStorage.getItem(CART_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return { items: [], subtotal: 0, discount: 0, total: 0 };
}

export function saveCart(cart: Cart): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
}

export function addToCart(product: Product, quantity: number): Cart {
  const cart = getCart();
  const existingIndex = cart.items.findIndex((item) => item.product.id === product.id);

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({ product, quantity });
  }

  return recalculateCart(cart);
}

export function removeFromCart(productId: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter((item) => item.product.id !== productId);
  return recalculateCart(cart);
}

export function updateQuantity(productId: string, quantity: number): Cart {
  const cart = getCart();
  const item = cart.items.find((item) => item.product.id === productId);
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
  }
  return recalculateCart(cart);
}

export function clearCart(): Cart {
  const empty: Cart = { items: [], subtotal: 0, discount: 0, total: 0 };
  saveCart(empty);
  return empty;
}

export function recalculateCart(cart: Cart): Cart {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = cart.items.reduce(
    (sum, item) =>
      sum +
      (item.product.discount
        ? (item.product.price * item.product.discount * item.quantity) / 100
        : 0),
    0
  );
  cart.subtotal = subtotal;
  cart.discount = discount;
  cart.total = subtotal - discount;
  saveCart(cart);
  return cart;
}

export function getCartCount(): number {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function computeItemsTotals(items: CartItem[]): { subtotal: number; discount: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = items.reduce(
    (sum, item) =>
      sum +
      (item.product.discount
        ? (item.product.price * item.product.discount * item.quantity) / 100
        : 0),
    0
  );
  return { subtotal, discount, total: subtotal - discount };
}

export function generateOrderMessageForItems(
  items: CartItem[],
  orderId: string,
  whatsappNumber: string,
): string {
  const { subtotal, discount, total } = computeItemsTotals(items);
  const lines: string[] = [];
  lines.push('السلام عليكم،');
  lines.push('أرغب في طلب المنتجات التالية من ORA PARFUM:');
  lines.push('');
  lines.push(`رقم الطلب: #${orderId}`);
  lines.push('');
  lines.push('المنتجات:');
  lines.push('');

  items.forEach((item, index) => {
    const discountedPrice = item.product.discount
      ? item.product.price - (item.product.price * item.product.discount) / 100
      : item.product.price;
    const lineTotal = discountedPrice * item.quantity;

    lines.push(`${index + 1}. ${item.product.name}`);
    lines.push(`   الكمية: ${item.quantity}`);
    lines.push(`   السعر: ${formatPrice(discountedPrice)}`);
    lines.push(`   المجموع: ${formatPrice(lineTotal)}`);
    lines.push('');
  });

  lines.push('--------------------');
  lines.push('');
  lines.push(`المجموع النهائي: ${formatPrice(total)}`);
  lines.push('');
  lines.push('شكراً لكم.');

  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}

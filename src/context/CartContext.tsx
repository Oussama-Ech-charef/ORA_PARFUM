'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart, Product } from '@/types';
import * as cartLib from '@/lib/cart';

interface CartContextType {
  cart: Cart;
  itemCount: number;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, discount: 0, total: 0 });
  const [itemCount, setItemCount] = useState(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = cartLib.getCart();
    setCart(saved);
    setItemCount(saved.items.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const addToCart = useCallback((product: Product, quantity: number) => {
    const updated = cartLib.addToCart(product, quantity);
    setCart(updated);
    setItemCount(updated.items.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    const updated = cartLib.removeFromCart(productId);
    setCart(updated);
    setItemCount(updated.items.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const updated = cartLib.updateQuantity(productId, quantity);
    setCart(updated);
    setItemCount(updated.items.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const clearCart = useCallback(() => {
    const updated = cartLib.clearCart();
    setCart(updated);
    setItemCount(0);
  }, []);

  const openCartDrawer = useCallback(() => {
    setIsCartDrawerOpen(true);
  }, []);

  const closeCartDrawer = useCallback(() => {
    setIsCartDrawerOpen(false);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart, itemCount, addToCart, removeFromCart, updateQuantity, clearCart,
        isCartDrawerOpen, openCartDrawer, closeCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

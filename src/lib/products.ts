'use client';

import { Product } from '@/types';
import { products as seedProducts } from '@/data/products';

const STORAGE_KEY = 'ora_products';

function getAll(): Product[] {
  if (typeof window === 'undefined') return [...seedProducts];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
  return [...seedProducts];
}

function saveAll(list: Product[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

export function getProducts(): Product[] {
  return getAll();
}

export function getProductById(id: string): Product | undefined {
  return getAll().find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAll().find((p) => p.slug === slug);
}

export function addProduct(product: Product): void {
  const list = getAll();
  list.push(product);
  saveAll(list);
}

export function updateProduct(id: string, updates: Partial<Product>): void {
  const list = getAll();
  const idx = list.findIndex((p) => p.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates };
    saveAll(list);
  }
}

export function deleteProduct(id: string): void {
  saveAll(getAll().filter((p) => p.id !== id));
}
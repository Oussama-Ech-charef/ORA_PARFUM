'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products as initialProducts } from '@/data/products';
import { Product } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { formatPrice } from '@/lib/format';

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');

  const filtered = productsList.filter(
    (p) => p.name.includes(search) || p.category.includes(search)
  );

  const toggleActive = (id: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const deleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rich-black">إدارة المنتجات</h1>
          <p className="text-warm-gray text-sm">إضافة وتعديل وحذف المنتجات</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-rich-black text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-colors flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          إضافة منتج
        </Link>
      </div>

      <div className="relative">
        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray" />
        <input
          type="text"
          placeholder="بحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ora-input pr-12"
        />
      </div>

      <div className="bg-white border border-cream rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream bg-ivory">
                <th className="text-right py-3 px-4 font-medium text-warm-gray">المنتج</th>
                <th className="text-right py-3 px-4 font-medium text-warm-gray">السعر</th>
                <th className="text-right py-3 px-4 font-medium text-warm-gray">المخزون</th>
                <th className="text-right py-3 px-4 font-medium text-warm-gray">التصنيف</th>
                <th className="text-right py-3 px-4 font-medium text-warm-gray">الحالة</th>
                <th className="text-center py-3 px-4 font-medium text-warm-gray">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-cream/50 hover:bg-ivory/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-ivory-dark overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-warm-gray">{product.volume}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">{formatPrice(product.price)}</span>
                    {product.discount && (
                      <span className="text-xs text-green-600 block">-{product.discount}%</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={product.stock <= 5 ? 'text-red-500 font-medium' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-warm-gray">{product.category}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleActive(product.id)}
                      className={`ora-badge text-xs cursor-pointer ${
                        product.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {product.active ? 'نشط' : 'غير نشط'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-warm-gray hover:text-gold transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-warm-gray hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

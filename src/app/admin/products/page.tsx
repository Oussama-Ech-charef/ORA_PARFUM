'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, deleteProduct, updateProduct } from '@/lib/products';
import { getCategories, addCategory, deleteCategory, getGenders, addGender, deleteGender } from '@/lib/categories';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronDown } from 'react-icons/fi';
import { formatPrice } from '@/lib/format';

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState(getProducts());
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(getCategories());
  const [genders, setGenders] = useState(getGenders());
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newGender, setNewGender] = useState('');

  useEffect(() => {
    setProductsList(getProducts());
    setCategories(getCategories());
    setGenders(getGenders());
  }, []);

  const refresh = () => {
    setProductsList(getProducts());
    setCategories(getCategories());
    setGenders(getGenders());
  };

  const filtered = productsList.filter(
    (p) => p.name.includes(search) || p.category.includes(search)
  );

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
      setProductsList(getProducts());
    }
  };

  const handleToggleActive = (id: string) => {
    const product = productsList.find((p) => p.id === id);
    if (product) {
      updateProduct(id, { active: !product.active });
      setProductsList(getProducts());
    }
  };

  const handleAddCategory = () => {
    const name = newCategory.trim();
    if (name && !categories.includes(name)) {
      addCategory(name);
      setNewCategory('');
      refresh();
    }
  };

  const handleDeleteCategory = (name: string) => {
    if (name === 'الكل') return;
    const usedCount = productsList.filter((p) => p.category === name).length;
    if (usedCount > 0 && !confirm(`هناك ${usedCount} منتج في هذا التصنيف. هل أنت متأكد من الحذف؟`)) return;
    deleteCategory(name);
    refresh();
  };

  const handleAddGender = () => {
    const name = newGender.trim();
    if (name && !genders.includes(name)) {
      addGender(name);
      setNewGender('');
      refresh();
    }
  };

  const handleDeleteGender = (name: string) => {
    if (name === 'الكل') return;
    const usedCount = productsList.filter((p) => p.gender === name).length;
    if (usedCount > 0 && !confirm(`هناك ${usedCount} منتج بهذا النوع. هل أنت متأكد من الحذف؟`)) return;
    deleteGender(name);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-rich-black">إدارة المنتجات</h1>
          <p className="text-warm-gray text-xs md:text-sm">إضافة وتعديل وحذف المنتجات</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCatManager(!showCatManager)}
            className="ora-btn-secondary ora-btn-sm flex items-center justify-center gap-2"
          >
            <FiChevronDown className={`w-4 h-4 transition-transform ${showCatManager ? 'rotate-180' : ''}`} />
            إدارة التصنيفات
          </button>
          <Link
            href="/admin/products/new"
            className="ora-btn-primary ora-btn-sm flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <FiPlus className="w-4 h-4" />
            إضافة منتج
          </Link>
        </div>
      </div>

      {showCatManager && (
        <div className="bg-white border border-cream rounded-xl p-4 md:p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-rich-black mb-3">التصنيفات</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.filter((c) => c !== 'الكل').map((cat) => (
                <div key={cat} className="flex items-center gap-1.5 bg-ivory rounded-lg px-3 py-1.5 text-sm">
                  <span>{cat}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-warm-gray hover:text-error transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="اسم التصنيف الجديد"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                className="ora-input flex-1"
              />
              <button onClick={handleAddCategory} className="ora-btn-primary ora-btn-sm flex items-center gap-1">
                <FiPlus className="w-4 h-4" />
                إضافة
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-rich-black mb-3">الأنواع</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {genders.filter((g) => g !== 'الكل').map((gen) => (
                <div key={gen} className="flex items-center gap-1.5 bg-ivory rounded-lg px-3 py-1.5 text-sm">
                  <span>{gen}</span>
                  <button
                    onClick={() => handleDeleteGender(gen)}
                    className="text-warm-gray hover:text-error transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="نوع جديد"
                value={newGender}
                onChange={(e) => setNewGender(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGender()}
                className="ora-input flex-1"
              />
              <button onClick={handleAddGender} className="ora-btn-primary ora-btn-sm flex items-center gap-1">
                <FiPlus className="w-4 h-4" />
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray w-5 h-5" />
        <input
          type="text"
          placeholder="بحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ora-input"
          style={{ paddingRight: '3rem' }}
        />
      </div>

      <div className="bg-white border border-cream rounded-xl overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
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
                      <span className="text-xs text-success block">-{product.discount}%</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={product.stock <= 5 ? 'text-error font-medium' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-warm-gray">{product.category}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(product.id)}
                      className={`ora-badge text-xs cursor-pointer ${
                        product.active
                          ? 'ora-badge-active'
                          : 'ora-badge-inactive'
                      }`}
                    >
                      {product.active ? 'نشط' : 'غير نشط'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="p-2 text-warm-gray hover:text-gold transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-warm-gray hover:text-error transition-colors"
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

        <div className="md:hidden divide-y divide-cream">
          {filtered.map((product) => (
            <div key={product.id} className="p-4">
              <div className="flex items-start gap-2.5 mb-2.5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-ivory-dark overflow-hidden flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-xs text-warm-gray">{product.volume}</p>
                  <p className="text-xs text-warm-gray mt-0.5 truncate">{product.category}</p>
                </div>
                <button
                  onClick={() => handleToggleActive(product.id)}
                  className={`ora-badge text-xs cursor-pointer flex-shrink-0 ${
                    product.active
                      ? 'ora-badge-active'
                      : 'ora-badge-inactive'
                  }`}
                >
                  {product.active ? 'نشط' : 'غير نشط'}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="whitespace-nowrap">
                    <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                    {product.discount && (
                      <span className="text-xs text-success mr-1">-{product.discount}%</span>
                    )}
                  </div>
                  <span className={`text-xs whitespace-nowrap ${product.stock <= 5 ? 'text-error font-medium' : 'text-warm-gray'}`}>
                    {product.stock}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="p-1.5 md:p-2 text-warm-gray hover:text-gold transition-colors"
                  >
                    <FiEdit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 md:p-2 text-warm-gray hover:text-error transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
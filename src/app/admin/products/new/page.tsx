'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    discount: '',
    stock: '',
    volume: '',
    description: '',
    notes: '',
    category: '',
    gender: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      ...form,
      id: Date.now().toString(),
      price: Number(form.price),
      discount: form.discount ? Number(form.discount) : 0,
      stock: Number(form.stock),
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem('ora_new_product', JSON.stringify(product));
    alert('تم إضافة المنتج بنجاح');
    router.push('/admin/products');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:text-gold transition-colors">
          <FiArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-rich-black">إضافة منتج جديد</h1>
          <p className="text-warm-gray text-sm">أدخل معلومات المنتج الجديد</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-cream rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">اسم المنتج</label>
            <input name="name" value={form.name} onChange={handleChange} className="ora-input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">الرابط (Slug)</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="ora-input" dir="ltr" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">السعر (DH)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className="ora-input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">الخصم (%)</label>
            <input type="number" name="discount" value={form.discount} onChange={handleChange} className="ora-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">المخزون</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} className="ora-input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">الحجم</label>
            <input name="volume" value={form.volume} onChange={handleChange} className="ora-input" placeholder="مثال: 100 مل" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">التصنيف</label>
            <select name="category" value={form.category} onChange={handleChange} className="ora-input" required>
              <option value="">اختر التصنيف</option>
              <option value="عطور شرقية">عطور شرقية</option>
              <option value="عطور زهرية">عطور زهرية</option>
              <option value="عطور بحرية">عطور بحرية</option>
              <option value="عطور فاخرة">عطور فاخرة</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">النوع</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="ora-input" required>
              <option value="">اختر النوع</option>
              <option value="للجنسين">للجنسين</option>
              <option value="رجالي">رجالي</option>
              <option value="نسائي">نسائي</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">الوصف</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="ora-input min-h-[100px]" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">النفحات العطرية</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="ora-input min-h-[80px]" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">رابط الصورة</label>
          <input name="image" value={form.image} onChange={handleChange} className="ora-input" dir="ltr" placeholder="/images/products/..." required />
        </div>

        <button type="submit" className="ora-btn-primary w-full">
          إضافة المنتج
        </button>
      </form>
    </div>
  );
}

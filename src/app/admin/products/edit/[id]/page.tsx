'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { getProductById, updateProduct } from '@/lib/products';
import Select from '@/components/Select';
import ImageUpload from '@/components/ImageUpload';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const product = getProductById(params.id as string);

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    price: product?.price?.toString() || '',
    discount: product?.discount?.toString() || '',
    stock: product?.stock?.toString() || '',
    volume: product?.volume || '',
    description: product?.description || '',
    notes: product?.notes || '',
    category: product?.category || '',
    gender: product?.gender || '',
    image: product?.image || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-warm-gray">المنتج غير موجود</p>
        <Link href="/admin/products" className="text-gold hover:underline mt-4 inline-block">
          العودة إلى قائمة المنتجات
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(product.id, {
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      discount: form.discount ? Number(form.discount) : 0,
      stock: Number(form.stock),
      volume: form.volume,
      description: form.description,
      notes: form.notes,
      category: form.category,
      gender: form.gender,
      image: form.image || product.image,
    });
    alert('تم تحديث المنتج بنجاح');
    router.push('/admin/products');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:text-gold transition-colors">
          <FiArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-rich-black">تعديل المنتج</h1>
          <p className="text-warm-gray text-sm">{product.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-cream rounded-xl p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="ora-label">اسم المنتج</label>
            <input name="name" value={form.name} onChange={handleChange} className="ora-input" required />
          </div>
          <div>
            <label className="ora-label">الرابط (Slug)</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="ora-input" dir="ltr" required />
          </div>
          <div>
            <label className="ora-label">السعر (درهم)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className="ora-input" required />
          </div>
          <div>
            <label className="ora-label">الخصم (%)</label>
            <input type="number" name="discount" value={form.discount} onChange={handleChange} className="ora-input" />
          </div>
          <div>
            <label className="ora-label">المخزون</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} className="ora-input" required />
          </div>
          <div>
            <label className="ora-label">الحجم</label>
            <input name="volume" value={form.volume} onChange={handleChange} className="ora-input" placeholder="مثال: 100 مل" required />
          </div>
          <div>
            <label className="ora-label">التصنيف</label>
            <Select
              options={[
                { value: '', label: 'اختر التصنيف' },
                { value: 'عطور شرقية', label: 'عطور شرقية' },
                { value: 'عطور زهرية', label: 'عطور زهرية' },
                { value: 'عطور بحرية', label: 'عطور بحرية' },
                { value: 'عطور فاخرة', label: 'عطور فاخرة' },
              ]}
              value={form.category}
              onChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
            />
          </div>
          <div>
            <label className="ora-label">النوع</label>
            <Select
              options={[
                { value: '', label: 'اختر النوع' },
                { value: 'للجنسين', label: 'للجنسين' },
                { value: 'رجالي', label: 'رجالي' },
                { value: 'نسائي', label: 'نسائي' },
              ]}
              value={form.gender}
              onChange={(val) => setForm((prev) => ({ ...prev, gender: val }))}
            />
          </div>
        </div>

        <div>
          <label className="ora-label">الوصف</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="ora-textarea" required />
        </div>

        <div>
          <label className="ora-label">النفحات العطرية</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="ora-textarea" required />
        </div>

        <div>
          <ImageUpload
            value={form.image || undefined}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url || '' }))}
          />
        </div>

        <button type="submit" className="ora-btn-primary w-full">
          تحديث المنتج
        </button>
      </form>
    </div>
  );
}
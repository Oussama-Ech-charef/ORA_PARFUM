'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { addProduct } from '@/lib/products';
import Select from '@/components/Select';
import ImageUpload from '@/components/ImageUpload';

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
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = form.image;

    if (selectedImageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedImageFile);

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: uploadFormData });

        if (!res.ok) {
          const errData = await res.json();
          alert(errData.error || 'فشل رفع الصورة');
          return;
        }

        const data = await res.json();
        imageUrl = data.url;
      } catch {
        alert('فشل رفع الصورة');
        return;
      }
    }

    addProduct({
      id: Date.now().toString(),
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
      image: imageUrl || '/images/products/ora-black.jpg',
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    });

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
          <h1 className="text-xl md:text-2xl font-bold text-rich-black">إضافة منتج جديد</h1>
          <p className="text-warm-gray text-sm">أدخل معلومات المنتج الجديد</p>
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
            onChange={(file) => setSelectedImageFile(file)}
          />
        </div>

        <button type="submit" className="ora-btn-primary w-full">
          إضافة المنتج
        </button>
      </form>
    </div>
  );
}
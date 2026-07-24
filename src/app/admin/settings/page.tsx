'use client';

import { useState } from 'react';
import { defaultSettings } from '@/data/settings';
import { FiSave } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [form, setForm] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ora_settings', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-rich-black">الإعدادات</h1>
        <p className="text-warm-gray text-sm">إعدادات الموقع وواتساب</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-cream rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">معلومات المتجر</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">اسم المتجر</label>
              <input name="storeName" value={form.storeName} onChange={handleChange} className="ora-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">رقم واتساب</label>
              <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} className="ora-input" dir="ltr" placeholder="212600000000" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">وصف المتجر</label>
              <textarea name="storeDescription" value={form.storeDescription} onChange={handleChange} className="ora-input" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">معلومات الاتصال</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">رقم الهاتف</label>
              <input name="contactPhone" value={form.contactPhone} onChange={handleChange} className="ora-input" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
              <input name="contactEmail" value={form.contactEmail} onChange={handleChange} className="ora-input" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">العنوان</label>
              <input name="address" value={form.address} onChange={handleChange} className="ora-input" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">روابط التواصل الاجتماعي</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">انستغرام</label>
              <input name="instagram" value={form.instagram} onChange={handleChange} className="ora-input" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">فيسبوك</label>
              <input name="facebook" value={form.facebook} onChange={handleChange} className="ora-input" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">تيك توك</label>
              <input name="tiktok" value={form.tiktok} onChange={handleChange} className="ora-input" dir="ltr" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">معلومات التوصيل</h2>
          <div>
            <label className="block text-sm font-medium mb-1.5">معلومات التوصيل</label>
            <textarea name="deliveryInfo" value={form.deliveryInfo} onChange={handleChange} className="ora-input" />
          </div>
        </div>

        <button
          type="submit"
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-rich-black text-white hover:bg-black'
          }`}
        >
          <FiSave className="w-4 h-4" />
          {saved ? 'تم الحفظ ✓' : 'حفظ الإعدادات'}
        </button>
      </form>
    </div>
  );
}

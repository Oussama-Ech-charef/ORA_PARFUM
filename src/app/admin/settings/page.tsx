'use client';

import { useState, useEffect } from 'react';
import { defaultSettings } from '@/data/settings';
import { FiSave, FiUpload } from 'react-icons/fi';
import { SiteSettings } from '@/types';

function getSavedSettings(): SiteSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const saved = localStorage.getItem('ora_settings');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultSettings;
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(getSavedSettings());
  }, []);

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
        <h1 className="text-xl md:text-2xl font-bold text-rich-black">الإعدادات</h1>
        <p className="text-warm-gray text-xs md:text-sm">إعدادات الموقع وواتساب</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-cream rounded-xl p-4 md:p-6 space-y-5 md:space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">معلومات المتجر</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="ora-label">اسم المتجر</label>
              <input name="storeName" value={form.storeName} onChange={handleChange} className="ora-input" />
            </div>
            <div>
              <label className="ora-label">رقم واتساب</label>
               <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} className="ora-input" dir="ltr" placeholder="212639860777" />
            </div>
            <div className="md:col-span-2">
              <label className="ora-label">وصف المتجر</label>
              <textarea name="storeDescription" value={form.storeDescription} onChange={handleChange} className="ora-textarea" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">معلومات الاتصال</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="ora-label">رقم الهاتف</label>
              <input name="contactPhone" value={form.contactPhone} onChange={handleChange} className="ora-input" dir="ltr" />
            </div>
            <div>
              <label className="ora-label">البريد الإلكتروني</label>
              <input name="contactEmail" value={form.contactEmail} onChange={handleChange} className="ora-input" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="ora-label">العنوان</label>
              <input name="address" value={form.address} onChange={handleChange} className="ora-input" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">روابط التواصل الاجتماعي</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="ora-label">انستغرام</label>
              <input name="instagram" value={form.instagram} onChange={handleChange} className="ora-input" dir="ltr" />
            </div>
            <div>
              <label className="ora-label">فيسبوك</label>
              <input name="facebook" value={form.facebook} onChange={handleChange} className="ora-input" dir="ltr" />
            </div>
            <div>
              <label className="ora-label">تيك توك</label>
              <input name="tiktok" value={form.tiktok} onChange={handleChange} className="ora-input" dir="ltr" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">معلومات التوصيل</h2>
          <div>
            <label className="ora-label">معلومات التوصيل</label>
            <textarea name="deliveryInfo" value={form.deliveryInfo} onChange={handleChange} className="ora-textarea" />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">شعار الموقع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="ora-label">رابط الشعار</label>
              <input name="logo" value={form.logo || ''} onChange={handleChange} className="ora-input" dir="ltr" placeholder="/logo1.png" />
            </div>
            <div>
              <label className="ora-label">أيقونة الموقع (Favicon)</label>
              <input name="favicon" value={form.favicon || ''} onChange={handleChange} className="ora-input" dir="ltr" placeholder="/logo1.png" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">الواجهة الرئيسية (Hero)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="ora-label">العنوان الرئيسي</label>
              <input name="heroTitle" value={form.heroTitle || ''} onChange={handleChange} className="ora-input" />
            </div>
            <div className="md:col-span-2">
              <label className="ora-label">النص الفرعي</label>
              <textarea name="heroSubtitle" value={form.heroSubtitle || ''} onChange={handleChange} className="ora-textarea" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">ساعات العمل</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="ora-label">أيام العمل</label>
              <input name="workingDays" value={form.workingDays || ''} onChange={handleChange} className="ora-input" placeholder="الإثنين - السبت" />
            </div>
            <div>
              <label className="ora-label">ساعات العمل</label>
              <input name="workingHours" value={form.workingHours || ''} onChange={handleChange} className="ora-input" placeholder="9:00 - 21:00" />
            </div>
            <div>
              <label className="ora-label">يوم العطلة</label>
              <input name="weekendDay" value={form.weekendDay || ''} onChange={handleChange} className="ora-input" placeholder="الأحد: مغلق" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-cream">تحسين محركات البحث (SEO)</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="ora-label">عنوان SEO</label>
              <input name="seoTitle" value={form.seoTitle || ''} onChange={handleChange} className="ora-input" />
            </div>
            <div>
              <label className="ora-label">وصف SEO</label>
              <textarea name="seoDescription" value={form.seoDescription || ''} onChange={handleChange} className="ora-textarea" />
            </div>
            <div>
              <label className="ora-label">كلمات مفتاحية</label>
              <textarea name="seoKeywords" value={form.seoKeywords || ''} onChange={handleChange} className="ora-textarea" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            saved
              ? 'bg-success text-white'
              : 'ora-btn-primary'
          }`}
        >
          <FiSave className="w-4 h-4" />
          {saved ? 'تم الحفظ ✓' : 'حفظ الإعدادات'}
        </button>
      </form>
    </div>
  );
}

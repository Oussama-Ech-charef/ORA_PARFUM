'use client';

import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';
import { SITE_CONFIG, getInquiryWhatsAppUrl } from '@/lib/config';
import { defaultSettings } from '@/data/settings';

export default function ContactPage() {
  const social = defaultSettings;
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const message = {
      id: Date.now().toString(),
      name: data.get('name') as string,
      email: data.get('email') as string,
      phone: data.get('phone') as string,
      message: data.get('message') as string,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('ora_messages') || '[]');
    existing.unshift(message);
    localStorage.setItem('ora_messages', JSON.stringify(existing));
    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 4000);
  };
  return (
    <>
      <section className="pt-28 pb-12 bg-gradient-to-b from-black to-rich-black">
        <div className="ora-container">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">اتصل بنا</h1>
          <p className="text-warm-gray">نحن هنا للإجابة على جميع استفساراتك</p>
        </div>
      </section>

      <section className="ora-section">
        <div className="ora-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">معلومات الاتصال</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-dark flex items-center justify-center flex-shrink-0">
                      <FiPhone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">الهاتف</h3>
                      <p className="text-warm-gray" dir="ltr">{SITE_CONFIG.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-dark flex items-center justify-center flex-shrink-0">
                      <FiMail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">البريد الإلكتروني</h3>
                      <p className="text-warm-gray">{SITE_CONFIG.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-dark flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">العنوان</h3>
                      <p className="text-warm-gray">الدار البيضاء، المغرب</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-dark flex items-center justify-center flex-shrink-0">
                      <FiClock className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">ساعات العمل</h3>
                      <p className="text-warm-gray">الإثنين - السبت: 9:00 - 21:00</p>
                      <p className="text-warm-gray">الأحد: مغلق</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">تابعنا</h2>
                <div className="flex gap-4">
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-gradient-dark flex items-center justify-center text-gold hover:bg-black transition-all hover:shadow-lg hover:shadow-gold-glow/20"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-gradient-dark flex items-center justify-center text-gold hover:bg-black transition-all hover:shadow-lg hover:shadow-gold-glow/20"
                  >
                    <FaFacebook className="w-5 h-5" />
                  </a>
                  <a
                    href={social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-gradient-dark flex items-center justify-center text-gold hover:bg-black transition-all hover:shadow-lg hover:shadow-gold-glow/20"
                  >
                    <FaTiktok className="w-5 h-5" />
                  </a>
                  <a
                    href={getInquiryWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:bg-[#20BD5A] transition-all hover:shadow-lg"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-cream rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">الاسم</label>
                  <input type="text" name="name" className="ora-input" placeholder="اسمك الكريم" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
                  <input type="email" name="email" className="ora-input" placeholder="بريدك الإلكتروني" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">رقم الهاتف</label>
                  <input type="tel" name="phone" className="ora-input" placeholder="رقم هاتفك" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">الرسالة</label>
                  <textarea
                    name="message"
                    className="ora-input min-h-[120px] resize-none"
                    placeholder="اكتب رسالتك هنا..."
                    required
                  />
                </div>
                <button type="submit" className="ora-btn-primary w-full">
                  {sent ? 'تم الإرسال ✓' : 'إرسال الرسالة'}
                </button>
              </form>
              <div className="mt-6 p-4 bg-cream/50 rounded-lg">
                <p className="text-sm text-warm-gray text-center">
                  أو تواصل معنا مباشرة عبر واتساب للحصول على رد أسرع
                </p>
                <a
                  href={getInquiryWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ora-btn-gold w-full mt-3 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  تواصل عبر واتساب
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

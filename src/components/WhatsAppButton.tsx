'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { getWhatsappNumber } from '@/lib/config';
import { defaultSettings } from '@/data/settings';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const msg = encodeURIComponent('مرحباً، أود الاستفسار عن منتجات ORA PARFUM');
  const [whatsappUrl, setWhatsappUrl] = useState(`https://wa.me/${defaultSettings.whatsappNumber}?text=${msg}`);

  useEffect(() => {
    setWhatsappUrl(`https://wa.me/${getWhatsappNumber()}?text=${msg}`);
  }, []);

  if (isAdmin) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-whatsapp text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-whatsapp-dark"
      aria-label="تواصل عبر واتساب"
    >
      <FaWhatsapp className="w-7 h-7" />
    </a>
  );
}

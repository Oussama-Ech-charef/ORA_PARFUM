'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { getInquiryWhatsAppUrl } from '@/lib/config';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <a
      href={getInquiryWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-whatsapp text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-whatsapp-dark"
      aria-label="تواصل عبر واتساب"
    >
      <FaWhatsapp className="w-7 h-7" />
    </a>
  );
}

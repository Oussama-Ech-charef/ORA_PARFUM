'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/config';
import { defaultSettings } from '@/data/settings';

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  const social = defaultSettings;

  return (
    <footer className="bg-black text-white">
      <div className="ora-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-[120px] h-[38px] md:w-[140px] md:h-[44px]">
                <Image
                  src="/logo1.png"
                  alt="ORA PARFUM"
                  fill
                  className="object-contain object-right brightness-0 invert"
                />
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              عطور فاخرة تجمع بين الأصالة والحداثة. كل عطر يحكي قصة من الفخامة والأناقة.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-5">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/60 hover:text-gold transition-colors text-sm">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-white/60 hover:text-gold transition-colors text-sm">
                  المتجر
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/60 hover:text-gold transition-colors text-sm">
                  قصتنا
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-gold transition-colors text-sm">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-5">معلومات الاتصال</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <FiPhone className="text-gold flex-shrink-0" />
                <span dir="ltr">{social.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <FiMail className="text-gold flex-shrink-0" />
                {social.contactEmail}
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <FiMapPin className="text-gold flex-shrink-0" />
                {social.address}
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold transition-all duration-300"
              >
                <FiInstagram className="w-4 h-4" />
              </a>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold transition-all duration-300"
              >
                <FiFacebook className="w-4 h-4" />
              </a>
              <a
                href={social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold transition-all duration-300"
              >
                <FaTiktok className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} ORA PARFUM. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}

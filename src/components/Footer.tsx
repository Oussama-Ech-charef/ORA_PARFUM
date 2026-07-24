'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <footer className="bg-black text-white">
      <div className="ora-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <Image
                  src="/logo1.png"
                  alt="ORA PARFUM"
                  width={48}
                  height={48}
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="text-xl font-bold tracking-wider">ORA PARFUM</span>
            </div>
            <p className="text-warm-gray text-sm leading-relaxed">
              عطور فاخرة تجمع بين الأصالة والحداثة. كل عطر يحكي قصة من الفخامة والأناقة.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-warm-gray hover:text-gold transition-colors text-sm">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-warm-gray hover:text-gold transition-colors text-sm">
                  المتجر
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-warm-gray hover:text-gold transition-colors text-sm">
                  سلة المشتريات
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-warm-gray hover:text-gold transition-colors text-sm">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-4">معلومات الاتصال</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-warm-gray text-sm">
                <FiPhone className="text-gold flex-shrink-0" />
                <span dir="ltr">+212 600 000 000</span>
              </li>
              <li className="flex items-center gap-2 text-warm-gray text-sm">
                <FiMail className="text-gold flex-shrink-0" />
                contact@oraparfum.com
              </li>
              <li className="flex items-center gap-2 text-warm-gray text-sm">
                <FiMapPin className="text-gold flex-shrink-0" />
                الدار البيضاء، المغرب
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-4">تابعنا</h3>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-warm-gray flex items-center justify-center text-warm-gray hover:text-gold hover:border-gold transition-all duration-300"
              >
                <FiInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-warm-gray flex items-center justify-center text-warm-gray hover:text-gold hover:border-gold transition-all duration-300"
              >
                <FiFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-warm-gray flex items-center justify-center text-warm-gray hover:text-gold hover:border-gold transition-all duration-300"
              >
                <FaTiktok className="w-4 h-4" />
              </a>
            </div>
            <p className="text-warm-gray text-sm mt-4">
              توصيل لجميع مدن المغرب
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-warm-gray text-sm">
            © {new Date().getFullYear()} ORA PARFUM. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}

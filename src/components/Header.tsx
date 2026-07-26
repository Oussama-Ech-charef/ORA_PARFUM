'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { getSettings } from '@/lib/settings';
import { defaultSettings } from '@/data/settings';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const { itemCount, openCartDrawer } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return null;

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/store', label: 'المتجر' },
    { href: '/about', label: 'قصتنا' },
    { href: '/contact', label: 'اتصل بنا' },
  ];

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="ora-container">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="block">
            <div className="relative w-[140px] h-[44px] md:w-[185px] md:h-[56px]">
              <Image
                src={settings.logo || '/logo1.png'}
                alt="ORA PARFUM"
                fill
                className="object-contain object-right"
                priority
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-gold ${
                  pathname === link.href
                    ? 'text-gold'
                    : scrolled || !isHome
                    ? 'text-rich-black'
                    : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
              <Link
              href="/admin/login"
              className={`p-2 transition-colors duration-300 hover:text-gold ${
                scrolled || !isHome ? 'text-rich-black' : 'text-white'
              }`}
              title="لوحة الإدارة"
            >
              <FiUser className="w-6 h-6" />
            </Link>

            <button
              onClick={openCartDrawer}
              className={`relative p-2 transition-colors duration-300 hover:text-gold ${
                scrolled || !isHome ? 'text-rich-black' : 'text-white'
              }`}
            >
              <FiShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-white text-xs flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 transition-colors ${
                scrolled || !isHome ? 'text-rich-black' : 'text-white'
              }`}
            >
              {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-cream">
          <div className="ora-container py-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium py-2 transition-colors ${
                    pathname === link.href ? 'text-gold' : 'text-rich-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

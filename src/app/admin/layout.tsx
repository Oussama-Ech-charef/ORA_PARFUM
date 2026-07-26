'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiLayout, FiPackage, FiShoppingBag, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { getUnreadCount } from '@/lib/messages';

const adminLinks = [
  { href: '/admin/dashboard', label: 'الإحصائيات', icon: FiLayout },
  { href: '/admin/products', label: 'المنتجات', icon: FiPackage },
  { href: '/admin/orders', label: 'الطلبات', icon: FiShoppingBag },
  { href: '/admin/messages', label: 'الرسائل', icon: FiMessageSquare },
  { href: '/admin/settings', label: 'الإعدادات', icon: FiSettings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(getUnreadCount());
    const interval = setInterval(() => setUnreadCount(getUnreadCount()), 30000);
    return () => clearInterval(interval);
  }, []);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        setAuthenticated(true);
      })
      .catch(() => {
        if (!pathname.startsWith('/admin/login')) {
          router.push('/admin/login');
        }
      })
      .finally(() => setLoading(false));
  }, [pathname, router]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, closeSidebar]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-warm-gray">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-ivory flex">
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="fixed top-3 right-3 md:top-4 md:right-4 z-50 lg:hidden bg-white border border-cream p-2.5 rounded-lg shadow-md"
        aria-label={sidebarOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
      >
        {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      <aside className={`fixed lg:sticky top-0 right-0 h-screen w-64 lg:w-56 xl:w-64 bg-rich-black text-white z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 md:p-6 overflow-y-auto flex-1">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <Link href="/admin/dashboard" className="flex items-center gap-3">
                <div className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0">
                  <Image
                    src="/logo1.png"
                    alt="ORA PARFUM"
                    width={40}
                    height={40}
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <div>
                  <span className="text-base md:text-lg font-bold">ORA PARFUM</span>
                  <p className="text-[10px] md:text-xs text-warm-gray">لوحة التحكم</p>
                </div>
              </Link>
              <button
                onClick={closeSidebar}
                className="lg:hidden p-1.5 text-warm-gray hover:text-white transition-colors"
                aria-label="إغلاق القائمة"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href === '/admin/products' && (pathname.startsWith('/admin/products/')));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-gold/20 text-gold'
                        : 'text-warm-gray hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                  {link.label}
                  {link.href === '/admin/messages' && unreadCount > 0 && (
                    <span className="mr-auto bg-gold text-white text-[10px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 md:p-6 border-t border-white/10">
            <Link href="/" className="block text-xs text-warm-gray hover:text-gold transition-colors mb-3">
              العودة للموقع
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-warm-gray hover:text-error transition-colors text-sm w-full"
            >
              <FiLogOut className="w-4 h-4 flex-shrink-0" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <main className="flex-1 min-w-0 p-3 md:p-4 lg:p-8 pt-14 md:pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
}

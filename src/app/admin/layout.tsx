'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiLayout, FiPackage, FiShoppingBag, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

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
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-white border border-cream p-2 rounded-lg shadow-md"
      >
        {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      <aside className={`fixed lg:sticky top-0 right-0 h-screen w-64 bg-rich-black text-white z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3 mb-8">
            <div className="relative w-10 h-10">
              <Image
                src="/logo1.png"
                alt="ORA PARFUM"
                width={40}
                height={40}
                className="object-contain brightness-0 invert"
              />
            </div>
            <div>
              <span className="text-lg font-bold">ORA PARFUM</span>
              <p className="text-xs text-warm-gray">لوحة التحكم</p>
            </div>
          </Link>

          <nav className="space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-gold/20 text-gold'
                      : 'text-warm-gray hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/" className="text-xs text-warm-gray hover:text-gold transition-colors">
              العودة للموقع
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-warm-gray hover:text-red-400 transition-colors text-sm w-full"
          >
            <FiLogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
}

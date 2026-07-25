'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch {
      setError('حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-cream rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative w-20 h-20">
                <Image
                  src="/logo1.png"
                  alt="ORA PARFUM"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-rich-black">لوحة التحكم</h1>
            <p className="text-warm-gray text-sm mt-1">ORA PARFUM</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="ora-label">اسم المستخدم</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="ora-input"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
            <div>
              <label className="ora-label">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ora-input"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {error && (
              <p className="text-error text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="ora-btn-primary w-full py-3"
            >
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

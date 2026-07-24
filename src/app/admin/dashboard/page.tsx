'use client';

import { useState, useEffect } from 'react';
import { products } from '@/data/products';
import { getOrders } from '@/lib/orders';
import { Order } from '@/types';
import { FiPackage, FiShoppingBag, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import { formatPrice } from '@/lib/format';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrders(getOrders());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeProducts = products.filter((p) => p.active);
  const newOrders = orders.filter((o) => o.status === 'جديد');
  const completedOrders = orders.filter((o) => o.status === 'مكتمل');
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.active && p.stock <= 5);

  const stats = [
    {
      label: 'إجمالي المنتجات',
      value: activeProducts.length,
      icon: FiPackage,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'الطلبات الجديدة',
      value: newOrders.length,
      icon: FiShoppingBag,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'الطلبات المكتملة',
      value: completedOrders.length,
      icon: FiShoppingBag,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'إجمالي المبيعات',
      value: formatPrice(totalSales),
      icon: FiDollarSign,
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-rich-black">لوحة الإحصائيات</h1>
        <p className="text-warm-gray text-sm">نظرة عامة على متجر ORA PARFUM</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-cream rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warm-gray">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-orange-700 mb-2">
            <FiAlertTriangle className="w-5 h-5" />
            <span className="font-semibold">منتجات على وشك النفاد</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <span key={p.id} className="bg-white px-3 py-1 rounded-full text-sm text-orange-600 border border-orange-200">
                {p.name} - {p.stock} قطع
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-cream rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">آخر الطلبات</h2>
        {orders.length === 0 ? (
          <p className="text-warm-gray text-center py-8">لا توجد طلبات بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream">
                  <th className="text-right py-3 px-2 font-medium text-warm-gray">رقم الطلب</th>
                  <th className="text-right py-3 px-2 font-medium text-warm-gray">المنتجات</th>
                  <th className="text-right py-3 px-2 font-medium text-warm-gray">المجموع</th>
                  <th className="text-right py-3 px-2 font-medium text-warm-gray">الحالة</th>
                  <th className="text-right py-3 px-2 font-medium text-warm-gray">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-cream/50 hover:bg-ivory/50">
                    <td className="py-3 px-2 font-medium">#{order.id}</td>
                    <td className="py-3 px-2">{order.items.length} منتج</td>
                    <td className="py-3 px-2">{formatPrice(order.total)}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`ora-badge text-xs ${
                          order.status === 'جديد'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'مكتمل'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'ملغى'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-warm-gray">
                      {new Date(order.createdAt).toLocaleDateString('ar-MA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

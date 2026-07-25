'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/products';
import { getOrders } from '@/lib/orders';
import { Order } from '@/types';
import { FiPackage, FiShoppingBag, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import { OrderStatus } from '@/types';

const statusBadgeClass: Record<OrderStatus, string> = {
  'جديد': 'ora-badge-status-new',
  'قيد المعالجة': 'ora-badge-status-processing',
  'تم التأكيد': 'ora-badge-status-confirmed',
  'تم الشحن': 'ora-badge-status-shipped',
  'مكتمل': 'ora-badge-status-completed',
  'ملغى': 'ora-badge-status-cancelled',
};
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

  const allProducts = getProducts();
  const activeProducts = allProducts.filter((p) => p.active);
  const newOrders = orders.filter((o) => o.status === 'جديد');
  const completedOrders = orders.filter((o) => o.status === 'مكتمل');
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = allProducts.filter((p) => p.active && p.stock <= 5);

  const stats = [
    {
      label: 'إجمالي المنتجات',
      value: activeProducts.length,
      icon: FiPackage,
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      label: 'الطلبات الجديدة',
      value: newOrders.length,
      icon: FiShoppingBag,
      color: 'text-warm-gray',
      bg: 'bg-cream',
    },
    {
      label: 'الطلبات المكتملة',
      value: completedOrders.length,
      icon: FiShoppingBag,
      color: 'text-gold-dark',
      bg: 'bg-gold/5',
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
        <h1 className="text-xl md:text-2xl font-bold text-rich-black">لوحة الإحصائيات</h1>
        <p className="text-warm-gray text-xs md:text-sm">نظرة عامة على متجر ORA PARFUM</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-cream rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-warm-gray">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold mt-1 truncate">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lowStock.length > 0 && (
        <div className="bg-warning-bg border border-warning/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-warning mb-2">
            <FiAlertTriangle className="w-5 h-5" />
            <span className="font-semibold">منتجات على وشك النفاد</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <span key={p.id} className="bg-white px-3 py-1 rounded-full text-sm text-warning border border-warning/20">
                {p.name} - {p.stock} قطع
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-cream rounded-xl p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold mb-4">آخر الطلبات</h2>
        {orders.length === 0 ? (
          <p className="text-warm-gray text-center py-6 md:py-8 text-sm">لا توجد طلبات بعد</p>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
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
                        <span className={`ora-badge text-xs ${statusBadgeClass[order.status]}`}>
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

            <div className="md:hidden space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="border border-cream rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gold text-sm">#{order.id}</span>
                    <span className={`ora-badge text-xs ${statusBadgeClass[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-warm-gray">{order.items.length} منتج</span>
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </div>
                  <p className="text-xs text-warm-gray mt-1">
                    {new Date(order.createdAt).toLocaleDateString('ar-MA')}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/orders';
import { Order, OrderStatus } from '@/types';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { formatPrice } from '@/lib/format';

const statuses: OrderStatus[] = ['جديد', 'قيد المعالجة', 'تم التأكيد', 'تم الشحن', 'مكتمل', 'ملغى'];
const statusColors: Record<string, string> = {
  'جديد': 'bg-blue-100 text-blue-700',
  'قيد المعالجة': 'bg-yellow-100 text-yellow-700',
  'تم التأكيد': 'bg-purple-100 text-purple-700',
  'تم الشحن': 'bg-indigo-100 text-indigo-700',
  'مكتمل': 'bg-green-100 text-green-700',
  'ملغى': 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    setOrders(getOrders());
  };

  const filtered = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-rich-black">إدارة الطلبات</h1>
        <p className="text-warm-gray text-xs md:text-sm">متابعة وتحديث حالات الطلبات</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray" />
          <input
            type="text"
            placeholder="بحث برقم الطلب..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ora-input pr-12"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="ora-input sm:w-48 appearance-none"
        >
          <option value="">جميع الحالات</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-cream rounded-xl p-8 md:p-12 text-center">
          <p className="text-warm-gray">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white border border-cream rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-ivory/50 transition-colors text-right"
              >
                <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-1">
                  <span className="font-bold text-gold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">#{order.id}</span>
                  <span className="text-warm-gray text-xs sm:text-sm">
                    {order.items.length} منتج
                  </span>
                  <span className="font-semibold text-sm sm:text-base">{formatPrice(order.total)}</span>
                  <span className={`ora-badge text-xs ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-warm-gray">
                    {new Date(order.createdAt).toLocaleDateString('ar-MA')}
                  </span>
                  <FiChevronDown className={`w-4 h-4 text-warm-gray transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {expandedOrder === order.id && (
                <div className="border-t border-cream p-4 space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-ivory/50 p-3 rounded-lg">
                        <div>
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-warm-gray mr-2">× {item.quantity}</span>
                        </div>
                        <span>{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm space-y-1 pt-2 border-t border-cream">
                    <div className="flex justify-between">
                      <span className="text-warm-gray">المجموع الفرعي</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>الخصم</span>
                        <span>-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>المجموع النهائي</span>
                      <span className="text-gold">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2">
                    <span className="text-sm text-warm-gray whitespace-nowrap">تحديث الحالة:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                       className="ora-input text-sm w-full sm:w-auto sm:max-w-[240px] appearance-none"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

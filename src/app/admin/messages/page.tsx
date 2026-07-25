'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/orders';
import { Order, OrderStatus } from '@/types';
import { FiMessageSquare, FiCheck, FiX } from 'react-icons/fi';
import { formatPrice } from '@/lib/format';

const statusColors: Record<string, string> = {
  'جديد': 'ora-badge-status-new',
  'قيد المعالجة': 'ora-badge-status-processing',
  'تم التأكيد': 'ora-badge-status-confirmed',
  'تم الشحن': 'ora-badge-status-shipped',
  'مكتمل': 'ora-badge-status-completed',
  'ملغى': 'ora-badge-status-cancelled',
};

export default function AdminMessagesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const updateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    setOrders(getOrders());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-rich-black">الرسائل والطلبات</h1>
        <p className="text-warm-gray text-xs md:text-sm">إدارة طلبات واتساب الواردة</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-cream rounded-xl p-8 md:p-12 text-center">
          <FiMessageSquare className="w-12 h-12 md:w-16 md:h-16 text-warm-gray mx-auto mb-4" />
          <p className="text-warm-gray">لا توجد رسائل أو طلبات بعد</p>
          <p className="text-sm text-warm-gray mt-1">عندما يرسل العملاء طلبات عبر واتساب، ستظهر هنا</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-cream rounded-xl overflow-hidden">
              <div
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer hover:bg-ivory/50 transition-colors text-right"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${order.status === 'جديد' ? 'bg-gold' : 'bg-light-gray'}`} />
                  <span className="font-bold text-gold text-sm sm:text-base">#{order.id}</span>
                  <span className="text-xs sm:text-sm text-warm-gray">{order.items.length} منتج</span>
                  <span className={`ora-badge text-xs ${statusColors[order.status]}`}>{order.status}</span>
                </div>
                <div className="flex items-center gap-2 mr-5 sm:mr-0">
                  <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                  <span className="text-xs text-warm-gray">{new Date(order.createdAt).toLocaleDateString('ar-MA')}</span>
                </div>
              </div>

              {expandedId === order.id && (
                <div className="border-t border-cream p-4 space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm bg-ivory/50 p-3 rounded-lg">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span>{formatPrice(item.product.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-cream pt-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-warm-gray">المجموع</span>
                      <span className="font-semibold">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cream">
                    <span className="text-sm font-medium ml-1">تحديث الحالة:</span>
                    {['جديد', 'قيد المعالجة', 'تم التأكيد', 'تم الشحن', 'مكتمل'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status as OrderStatus)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          order.status === status
                            ? 'bg-rich-black text-white'
                            : 'bg-cream text-rich-black hover:bg-gold/20'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                    <button
                      onClick={() => updateStatus(order.id, 'ملغى')}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-error-bg text-error hover:bg-error-bg/80 transition-all"
                    >
                      ملغى
                    </button>
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

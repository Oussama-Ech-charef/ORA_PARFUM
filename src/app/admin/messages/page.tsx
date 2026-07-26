'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/orders';
import { getMessages, markAsRead, markAllAsRead, deleteMessage } from '@/lib/messages';
import { Order, OrderStatus, Message } from '@/types';
import { FiMessageSquare, FiCheck, FiX, FiTrash2, FiMail, FiChevronDown } from 'react-icons/fi';
import { formatPrice } from '@/lib/format';

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
}

const statusColors: Record<string, string> = {
  'جديد': 'ora-badge-status-new',
  'قيد المعالجة': 'ora-badge-status-processing',
  'تم التأكيد': 'ora-badge-status-confirmed',
  'تم الشحن': 'ora-badge-status-shipped',
  'مكتمل': 'ora-badge-status-completed',
  'ملغى': 'ora-badge-status-cancelled',
};

export default function AdminMessagesPage() {
  const [tab, setTab] = useState<'messages' | 'orders'>('messages');
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setOrders(getOrders());
    setMessages(getMessages());
  }, []);

  const refreshMessages = () => setMessages(getMessages());

  const updateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    setOrders(getOrders());
  };

  const tabs = [
    { key: 'messages' as const, label: 'الرسائل', count: messages.filter((m) => !m.read).length },
    { key: 'orders' as const, label: 'الطلبات', count: orders.filter((o) => o.status === 'جديد').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-rich-black">الرسائل والطلبات</h1>
        <p className="text-warm-gray text-xs md:text-sm">إدارة رسائل الاتصال وطلبات واتساب</p>
      </div>

      <div className="flex gap-1 bg-cream/50 rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-white text-rich-black shadow-sm'
                : 'text-warm-gray hover:text-rich-black'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className="mr-1.5 bg-gold text-white text-xs rounded-full px-2 py-0.5">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'messages' && (
        <>
          {messages.length === 0 ? (
            <div className="bg-white border border-cream rounded-xl p-8 md:p-12 text-center">
              <FiMail className="w-12 h-12 md:w-16 md:h-16 text-warm-gray mx-auto mb-4" />
              <p className="text-warm-gray">لا توجد رسائل بعد</p>
              <p className="text-sm text-warm-gray mt-1">عندما يرسل الزوار رسائل عبر صفحة الاتصال، ستظهر هنا</p>
            </div>
          ) : (
            <>
              {messages.some((m) => !m.read) && (
                <div className="flex justify-end">
                  <button
                    onClick={() => { markAllAsRead(); refreshMessages(); }}
                    className="text-xs text-warm-gray hover:text-rich-black transition-colors flex items-center gap-1"
                  >
                    <FiCheck className="w-3.5 h-3.5" />
                    تحديد الكل كمقروء
                  </button>
                </div>
              )}
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-white border rounded-xl overflow-hidden transition-all ${
                      !msg.read ? 'border-gold/30 ring-1 ring-gold/10' : 'border-cream'
                    }`}
                  >
                    <div
                      onClick={() => {
                        setExpandedId(expandedId === msg.id ? null : msg.id);
                        if (!msg.read) {
                          markAsRead(msg.id);
                          refreshMessages();
                        }
                      }}
                      className="p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-ivory/50 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!msg.read ? 'bg-gold' : 'bg-light-gray'}`} />
                        <div className="min-w-0">
                          <p className={`text-sm ${!msg.read ? 'font-semibold text-rich-black' : 'text-rich-black'}`}>
                            {msg.name}
                          </p>
                          <p className="text-xs text-warm-gray truncate mt-0.5">{msg.message}</p>
                          <p className="text-xs text-warm-gray/60 mt-0.5">{msg.email}{msg.phone ? ` - ${msg.phone}` : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-warm-gray/60 whitespace-nowrap">{formatDate(msg.createdAt)}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); refreshMessages(); }}
                          className="p-1.5 text-warm-gray hover:text-error transition-colors"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                        <FiChevronDown className={`w-4 h-4 text-warm-gray transition-transform ${expandedId === msg.id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {expandedId === msg.id && (
                      <div className="border-t border-cream p-4">
                        <div className="text-sm text-warm-gray leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </div>
                        <div className="mt-3 text-xs text-warm-gray/60 space-y-0.5">
                          <p>الاسم: {msg.name}</p>
                          <p>البريد: {msg.email}</p>
                          {msg.phone && <p>الهاتف: {msg.phone}</p>}
                          <p>التاريخ: {formatDate(msg.createdAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {tab === 'orders' && (
        <>
          {orders.length === 0 ? (
            <div className="bg-white border border-cream rounded-xl p-8 md:p-12 text-center">
              <FiMessageSquare className="w-12 h-12 md:w-16 md:h-16 text-warm-gray mx-auto mb-4" />
              <p className="text-warm-gray">لا توجد طلبات بعد</p>
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
                      <span className="text-xs text-warm-gray">{formatDate(order.createdAt)}</span>
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
        </>
      )}
    </div>
  );
}

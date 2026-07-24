'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SITE_CONFIG } from '@/lib/config';
import { generateOrderId, addOrder } from '@/lib/orders';
import { formatPrice } from '@/lib/format';
import { PACKAGING_OPTIONS } from '@/data/packaging';

export default function CartDrawer() {
  const {
    cart, itemCount, isCartDrawerOpen, closeCartDrawer,
    updateQuantity, removeFromCart, updatePackaging, clearCart, getWhatsAppUrl,
  } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartDrawerOpen) closeCartDrawer();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCartDrawerOpen, closeCartDrawer]);

  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartDrawerOpen]);

  const handleWhatsAppCheckout = useCallback(() => {
    if (cart.items.length === 0) return;

    const missingPackaging = cart.items.find(
      (item) => !item.packagingOption
    );
    if (missingPackaging) {
      setValidationError('يرجى اختيار نوع التغليف لكل منتج قبل إتمام الطلب.');
      setTimeout(() => setValidationError(''), 4000);
      return;
    }
    setValidationError('');

    const orderId = generateOrderId();
    addOrder({
      id: orderId,
      items: [...cart.items],
      subtotal: cart.subtotal,
      discount: cart.discount,
      total: cart.total,
      status: 'جديد',
      createdAt: new Date().toISOString(),
    });
    const url = getWhatsAppUrl(orderId, SITE_CONFIG.whatsappNumber);
    window.open(url, '_blank');
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 3000);
  }, [cart, getWhatsAppUrl]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isCartDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCartDrawer}
      />

      <div
        className={`fixed top-0 bottom-0 z-50 w-full sm:w-[460px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-cream">
          <div className="flex items-center gap-3">
            <FiShoppingBag className="w-5 h-5 text-rich-black" />
            <h2 className="text-lg font-bold text-rich-black">سلة المشتريات</h2>
            {itemCount > 0 && (
              <span className="text-sm text-warm-gray">({itemCount})</span>
            )}
          </div>
          <button
            onClick={closeCartDrawer}
            className="p-2 hover:text-gold transition-colors rounded-lg hover:bg-cream"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-ivory-dark flex items-center justify-center mb-5">
              <FiShoppingBag className="w-8 h-8 text-warm-gray" />
            </div>
            <p className="text-lg font-semibold text-rich-black mb-2">السلة فارغة</p>
            <p className="text-sm text-warm-gray mb-6">لم تقم بإضافة أي منتجات بعد</p>
            <button
              onClick={closeCartDrawer}
              className="ora-btn-primary text-sm"
            >
              تصفح المنتجات
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.items.map((item) => {
                const discountPrice = item.product.discount
                  ? item.product.price - (item.product.price * item.product.discount) / 100
                  : null;
                const itemTotal = discountPrice
                  ? discountPrice * item.quantity
                  : item.product.price * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 bg-ivory rounded-xl p-3"
                  >
                    <div className="relative w-20 h-20 rounded-lg bg-white overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                      <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-warm-gray truncate">{item.product.category}</p>
                          <h4 className="font-semibold text-rich-black text-sm truncate">{item.product.name}</h4>
                          <p className="text-xs text-warm-gray">{item.product.volume}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-warm-gray hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-warm-gray whitespace-nowrap">التغليف:</span>
                        <select
                          value={item.packagingOption}
                          onChange={(e) => updatePackaging(item.product.id, e.target.value)}
                          className="text-xs bg-white border border-light-gray rounded-md px-2 py-1 flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-gold/40"
                          style={{ fontFamily: "'Cairo', sans-serif" }}
                        >
                          {PACKAGING_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-light-gray rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:text-gold transition-colors"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1.5 font-semibold text-xs min-w-[1.5rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 hover:text-gold transition-colors"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-rich-black">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={clearCart}
                className="text-xs text-warm-gray hover:text-red-500 transition-colors"
              >
                تفريغ السلة
              </button>
            </div>

            <div className="border-t border-cream p-5 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-gray">المجموع الفرعي</span>
                  <span className="font-semibold">{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم</span>
                    <span>- {formatPrice(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-cream pt-2">
                  <span className="font-semibold">المجموع النهائي</span>
                  <span className="text-lg font-bold text-gold">
                    {formatPrice(cart.total)}
                  </span>
                </div>
              </div>

              {validationError && (
                <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <button
                onClick={handleWhatsAppCheckout}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 ${
                  orderPlaced
                    ? 'bg-green-500 text-white'
                    : 'bg-[#25D366] text-white hover:bg-[#20BD5A] hover:shadow-lg'
                }`}
              >
                <FaWhatsapp className="w-5 h-5" />
                {orderPlaced ? 'تم إرسال الطلب ✓' : 'شراء عبر واتساب'}
              </button>

              <Link
                href="/cart"
                onClick={closeCartDrawer}
                className="block w-full text-center py-3 rounded-xl border border-cream text-sm font-medium text-rich-black hover:bg-ivory transition-colors"
              >
                عرض صفحة السلة الكاملة
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

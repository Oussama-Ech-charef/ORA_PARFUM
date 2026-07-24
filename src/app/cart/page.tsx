'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { generateOrderId, addOrder } from '@/lib/orders';
import { formatPrice } from '@/lib/format';
import { SITE_CONFIG } from '@/lib/config';
import { PACKAGING_OPTIONS } from '@/data/packaging';

export default function CartPage() {
  const { cart, itemCount, updateQuantity, removeFromCart, updatePackaging, clearCart, getWhatsAppUrl } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleWhatsAppCheckout = () => {
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
  };

  if (cart.items.length === 0) {
    return (
      <>
        <section className="pt-28 pb-8 bg-gradient-to-b from-black to-rich-black">
          <div className="ora-container">
            <h1 className="text-3xl md:text-5xl font-bold text-white">سلة المشتريات</h1>
          </div>
        </section>
        <section className="ora-section">
          <div className="ora-container text-center py-20">
            <FiShoppingBag className="w-20 h-20 text-warm-gray mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-3">السلة فارغة</h2>
            <p className="text-warm-gray mb-8">لم تقم بإضافة أي منتجات بعد</p>
            <Link href="/store" className="ora-btn-primary">
              <FiArrowRight className="w-5 h-5" />
              تصفح المنتجات
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="pt-28 pb-8 bg-gradient-to-b from-black to-rich-black">
        <div className="ora-container">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">سلة المشتريات</h1>
          <p className="text-warm-gray">{itemCount} منتج في السلة</p>
        </div>
      </section>

      <section className="ora-section">
        <div className="ora-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
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
                    className="bg-white border border-cream rounded-xl p-4 flex gap-4 hover:border-gold-light transition-all duration-300"
                  >
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-lg bg-ivory-dark overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-warm-gray">{item.product.category}</p>
                          <h3 className="font-semibold text-rich-black">{item.product.name}</h3>
                          <p className="text-xs text-warm-gray">{item.product.volume} | {item.product.gender}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-warm-gray hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-warm-gray whitespace-nowrap">التغليف:</span>
                        <select
                          value={item.packagingOption}
                          onChange={(e) => updatePackaging(item.product.id, e.target.value)}
                          className="text-sm bg-white border border-light-gray rounded-lg px-3 py-1.5 flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-gold/40"
                          style={{ fontFamily: "'Cairo', sans-serif" }}
                        >
                          {PACKAGING_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-light-gray rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 hover:text-gold transition-colors"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="px-4 py-2 font-semibold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 hover:text-gold transition-colors"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-left">
                          {discountPrice ? (
                            <div>
                              <span className="text-lg font-bold text-rich-black">
                                {formatPrice(itemTotal)}
                              </span>
                              <span className="text-xs text-warm-gray line-through block">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-rich-black">
                              {formatPrice(itemTotal)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={clearCart}
                className="text-sm text-warm-gray hover:text-red-500 transition-colors mt-4"
              >
                تفريغ السلة
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-cream rounded-xl p-6 sticky top-28">
                <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>

                <div className="space-y-3 text-sm">
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

                  <div className="border-t border-cream pt-3 flex justify-between">
                    <span className="font-semibold">المجموع النهائي</span>
                    <span className="text-xl font-bold text-gold">
                      {formatPrice(cart.total)}
                    </span>
                  </div>
                </div>

                {validationError && (
                  <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3 mt-4">
                    <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                <button
                  onClick={handleWhatsAppCheckout}
                  className={`w-full mt-6 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    orderPlaced
                      ? 'bg-green-500 text-white'
                      : 'bg-[#25D366] text-white hover:bg-[#20BD5A] hover:shadow-lg'
                  }`}
                >
                  <FaWhatsapp className="w-6 h-6" />
                  {orderPlaced ? 'تم إرسال الطلب ✓' : 'شراء عبر واتساب'}
                </button>

                <p className="text-xs text-warm-gray text-center mt-3">
                  سيتم فتح واتساب مباشرة مع رسالة الطلب كاملة
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

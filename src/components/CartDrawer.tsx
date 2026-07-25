'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SITE_CONFIG } from '@/lib/config';
import { formatPrice } from '@/lib/format';
import { generateOrderMessageForItems, computeItemsTotals } from '@/lib/cart';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart, itemCount, isCartDrawerOpen, closeCartDrawer,
    updateQuantity, removeFromCart, clearCart,
  } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isCartDrawerOpen) {
      setSelectedItems(new Set(cart.items.map((item) => item.product.id)));
    }
  }, [isCartDrawerOpen, cart.items]);

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

  const toggleItem = (productId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const allSelected = cart.items.length > 0 && cart.items.every((item) => selectedItems.has(item.product.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.items.map((item) => item.product.id)));
    }
  };

  const filteredItems = cart.items.filter((item) => selectedItems.has(item.product.id));
  const selectedTotals = computeItemsTotals(filteredItems);

  const handleWhatsAppCheckout = useCallback(() => {
    if (filteredItems.length === 0) {
      setValidationError('يرجى اختيار منتج واحد على الأقل لإتمام الطلب.');
      setTimeout(() => setValidationError(''), 4000);
      return;
    }
    setValidationError('');

    const orderId = `#ORA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const url = generateOrderMessageForItems(filteredItems, orderId, SITE_CONFIG.whatsappNumber);
    window.open(url, '_blank');
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 3000);
  }, [filteredItems, selectedTotals]);

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
              onClick={() => { closeCartDrawer(); router.push('/store'); }}
              className="ora-btn-primary text-sm cursor-pointer"
            >
              تصفح المنتجات
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <button
                onClick={toggleAll}
                className="text-xs text-warm-gray hover:text-rich-black transition-colors"
              >
                {allSelected ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
              </button>
              <span className="text-xs text-warm-gray">{filteredItems.length} من {cart.items.length} منتج محدد</span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.items.map((item) => {
                const discountPrice = item.product.discount
                  ? item.product.price - (item.product.price * item.product.discount) / 100
                  : null;
                const itemTotal = discountPrice
                  ? discountPrice * item.quantity
                  : item.product.price * item.quantity;
                const isSelected = selectedItems.has(item.product.id);

                return (
                  <div
                    key={item.product.id}
                    className={`flex gap-4 rounded-xl p-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-ivory ring-1 ring-gold/20' : 'bg-ivory/60'
                    }`}
                    onClick={() => toggleItem(item.product.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`ora-checkbox ora-checkbox-sm ${isSelected ? 'checked' : ''}`}
                      >
                        <svg className="ora-checkbox-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>

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
                          onClick={(e) => { e.stopPropagation(); removeFromCart(item.product.id); }}
                          className="p-1 text-warm-gray hover:text-error transition-colors flex-shrink-0"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="ora-quantity">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity - 1); }}
                            className="ora-quantity-btn"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="ora-quantity-value">{item.quantity}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity + 1); }}
                            className="ora-quantity-btn"
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
                className="text-xs text-warm-gray hover:text-error transition-colors"
              >
                تفريغ السلة
              </button>
            </div>

            <div className="border-t border-cream p-5 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-gray">المجموع الفرعي (المنتجات المحددة)</span>
                  <span className="font-semibold">{formatPrice(selectedTotals.subtotal)}</span>
                </div>
                {selectedTotals.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>الخصم</span>
                    <span>- {formatPrice(selectedTotals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-cream pt-2">
                  <span className="font-semibold">المجموع النهائي</span>
                  <span className="text-lg font-bold text-gold">
                    {formatPrice(selectedTotals.total)}
                  </span>
                </div>
              </div>

              {validationError && (
                <div className="flex items-center gap-2 text-xs text-error bg-error-bg rounded-lg px-3 py-2">
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <button
                onClick={handleWhatsAppCheckout}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 ${
                  orderPlaced
                    ? 'bg-success text-white'
                    : 'bg-whatsapp text-white hover:bg-whatsapp-dark hover:shadow-lg'
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
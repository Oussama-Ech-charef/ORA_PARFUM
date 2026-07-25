'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProducts } from '@/lib/products';
import { products as seedProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { FiShoppingCart, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SITE_CONFIG } from '@/lib/config';
import { formatPrice } from '@/lib/format';
import { generateOrderId } from '@/lib/orders';

export default function ProductPage() {
  const params = useParams();
  const { addToCart, cart } = useCart();
  const [products, setProducts] = useState([...seedProducts]);
  useEffect(() => {
    setProducts(getProducts());
  }, []);
  const product = products.find((p) => p.slug === params.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Link href="/store" className="ora-btn-primary">
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  const discountPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppPurchase = () => {
    const orderId = generateOrderId();
    const effectivePrice = discountPrice || product.price;
    const lineTotal = effectivePrice * quantity;

    const lines: string[] = [];
    lines.push('السلام عليكم،');
    lines.push('أرغب في طلب هذا العطر من ORA PARFUM:');
    lines.push('');
    lines.push(`اسم العطر: ${product.name}`);
    lines.push(`الكمية: ${quantity}`);
    lines.push(`السعر: ${formatPrice(effectivePrice)}`);
    lines.push(`المجموع: ${formatPrice(lineTotal)}`);
    if (product.discount) {
      lines.push(`(الخصم: ${product.discount}%)`);
    }
    lines.push('');
    lines.push(`رقم الطلب: #${orderId}`);
    lines.push('');
    lines.push('شكراً لكم.');

    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank');
    setOrderSent(true);
    setTimeout(() => setOrderSent(false), 3000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.active)
    .slice(0, 4);

  const initials = product.name.split(' ').map(w => w[0]).join('');

  return (
    <>
      <section className="pt-28 pb-8 bg-gradient-to-b from-black to-rich-black">
        <div className="ora-container">
          <nav className="flex items-center gap-2 text-sm text-warm-gray">
            <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/store" className="hover:text-gold transition-colors">المتجر</Link>
            <span>/</span>
            <span className="text-gold">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="ora-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="relative aspect-square bg-ivory-dark rounded-xl overflow-hidden border border-cream">
              {imgError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-dark flex items-center justify-center mx-auto mb-3">
                      <span className="text-gold text-2xl font-bold">{initials}</span>
                    </div>
                    <span className="text-warm-gray text-sm">ORA PARFUM</span>
                  </div>
                </div>
              ) : (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onError={() => setImgError(true)}
                />
              )}
              {product.discount && (
                <div className="absolute top-4 right-4 ora-badge ora-badge-discount text-sm px-4 py-1.5">
                  خصم {product.discount}%
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-warm-gray text-sm uppercase tracking-wider mb-1">{product.category}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-rich-black">{product.name}</h1>
              </div>

              <div className="flex items-baseline gap-3">
                {discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-rich-black">
                      {formatPrice(discountPrice!)}
                    </span>
                    <span className="text-xl text-warm-gray line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="ora-badge ora-badge-discount">
                      -{product.discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-rich-black">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="text-warm-gray">الحجم: <strong className="text-rich-black">{product.volume}</strong></span>
                <span className="text-warm-gray">|</span>
                <span className="text-warm-gray">النوع: <strong className="text-rich-black">{product.gender}</strong></span>
                <span className="text-warm-gray">|</span>
                <span className="text-warm-gray">
                  المخزون:{' '}
                  <strong className={product.stock > 5 ? 'text-success' : 'text-error'}>
                    {product.stock > 0 ? `${product.stock} قطعة` : 'نفذ'}
                  </strong>
                </span>
              </div>

              <div className="border-t border-b border-cream py-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-rich-black mb-2">الوصف</h3>
                  <p className="text-warm-gray leading-relaxed">{product.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-rich-black mb-2">النفحات العطرية</h3>
                  <p className="text-warm-gray leading-relaxed">{product.notes}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="ora-quantity">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="ora-quantity-btn"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="ora-quantity-value">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="ora-quantity-btn"
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    product.stock === 0
                      ? 'bg-light-gray/50 text-warm-gray/50 cursor-not-allowed'
                      : added
                      ? 'bg-success text-white'
                      : 'bg-rich-black text-white hover:bg-black'
                  }`}
                >
                  {added ? (
                    <>
                      <FiCheck className="w-5 h-5" />
                      تمت الإضافة ✓
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-5 h-5" />
                      أضف إلى السلة
                    </>
                  )}
                </button>
                <button
                  onClick={handleWhatsAppPurchase}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    product.stock === 0
? 'bg-light-gray/50 text-warm-gray/50 cursor-not-allowed'
                      : orderSent
                      ? 'bg-success text-white'
                      : 'bg-whatsapp text-white hover:bg-whatsapp-dark hover:shadow-lg'
                  }`}
                >
                  <FaWhatsapp className="w-5 h-5" />
                  {orderSent ? 'تم إرسال الطلب ✓' : 'شراء عبر واتساب'}
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm text-warm-gray pt-2">
                <div className="flex items-center gap-1.5">
                  <FiCheck className="text-success w-4 h-4" />
                  منتج أصلي
                </div>
                <div className="flex items-center gap-1.5">
                  <FiCheck className="text-success w-4 h-4" />
                  توصيل سريع
                </div>
                <div className="flex items-center gap-1.5">
                  <FiCheck className="text-success w-4 h-4" />
                  ضمان الجودة
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="ora-section bg-cream/30">
          <div className="ora-container">
            <h2 className="section-title">منتجات مشابهة</h2>
            <p className="section-subtitle">قد تعجبك أيضاً</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

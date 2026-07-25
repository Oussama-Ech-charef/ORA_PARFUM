'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import { formatPrice } from '@/lib/format';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const discountPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const initials = product.name.split(' ').map(w => w[0]).join('');

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block bg-white rounded-lg border border-cream overflow-hidden transition-all duration-500 hover:border-gold-light hover:shadow-lg hover:shadow-gold-glow/10"
    >
      <div className="relative aspect-square bg-ivory-dark overflow-hidden">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-dark flex items-center justify-center mx-auto mb-2">
                <span className="text-gold text-lg md:text-xl font-bold">{initials}</span>
              </div>
              <span className="text-warm-gray text-[10px] md:text-xs">ORA PARFUM</span>
            </div>
          </div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        )}
        {product.discount && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 ora-badge ora-badge-discount text-[10px] md:text-xs px-1.5 py-0.5 md:px-3 md:py-1 z-10">
            -{product.discount}%
          </div>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 ora-badge bg-black/80 text-white text-[10px] md:text-xs px-1.5 py-0.5 md:px-3 md:py-1">
            متبقي {product.stock}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm md:text-lg">نفذ من المخزون</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
      </div>

      <div className="p-3 md:p-4 space-y-1.5 md:space-y-2">
        <p className="text-[10px] md:text-xs text-warm-gray uppercase tracking-wider">{product.category}</p>
        <h3 className="text-sm md:text-base font-semibold text-rich-black group-hover:text-gold transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[10px] md:text-xs text-warm-gray">{product.volume} | {product.gender}</p>
        <div className="flex items-center gap-1.5 md:gap-2">
          {discountPrice ? (
            <>
              <span className="text-base md:text-lg font-bold text-rich-black">
                {formatPrice(discountPrice!)}
              </span>
              <span className="text-xs md:text-sm text-warm-gray line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base md:text-lg font-bold text-rich-black">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 ${
            product.stock === 0
              ? 'bg-light-gray/50 text-warm-gray/50 cursor-not-allowed'
              : added
              ? 'bg-success text-white'
              : 'bg-rich-black text-white hover:bg-black'
          }`}
        >
          {added ? (
            'تمت الإضافة ✓'
          ) : (
            <>
              <FiShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
              أضف للسلة
            </>
          )}
        </button>
      </div>
    </Link>
  );
}

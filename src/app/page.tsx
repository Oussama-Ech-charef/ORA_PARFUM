'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { products as seedProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { FiChevronDown, FiStar, FiShield, FiTruck, FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getSettings } from '@/lib/settings';
import { defaultSettings } from '@/data/settings';

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const inquiryUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن منتجات ORA PARFUM')}`;

  const [allProducts, setAllProducts] = useState([...seedProducts]);
  useEffect(() => {
    setAllProducts(getProducts());
  }, []);
  const featuredProducts = allProducts.filter((p) => p.active).slice(0, 4);
  const discountedProducts = allProducts.filter((p) => p.discount && p.active);
  const newProducts = [...allProducts].filter((p) => p.active).slice(0, 4);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold-glow)_0%,_transparent_70%)] opacity-30" />
        <div className="relative z-10 ora-container text-center py-32">
          <div
            className={`transition-all duration-1000 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex justify-center mb-8">
              <div className="relative w-28 h-28 md:w-36 md:h-36">
                <Image
                  src="/logo1.png"
                  alt="ORA PARFUM"
                  width={144}
                  height={144}
                  className="object-contain brightness-0 invert"
                  priority
                  onLoad={() => setHeroLoaded(true)}
                />
              </div>
            </div>
            <div className="w-24 h-0.5 bg-gold mx-auto mb-8" />
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-wide">
              {settings.heroTitle || 'ORA PARFUM'}
            </h1>
            <p className="text-lg md:text-xl text-warm-gray mb-10 max-w-2xl mx-auto">
              {settings.heroSubtitle || 'عطور فاخرة تجمع بين أصالة الشرق وحداثة الغرب. كل عطر يحكي قصة من الفخامة والأناقة.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/store"
                className="ora-btn-primary text-lg px-10 py-4"
              >
                اكتشف تشكيلتنا
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <a
                href={inquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ora-btn-gold text-lg px-10 py-4"
              >
                <FaWhatsapp className="w-5 h-5" />
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <FiChevronDown className="w-6 h-6 text-gold/50" />
        </div>
      </section>

      <section className="ora-section">
        <div className="ora-container">
          <div className="text-center mb-12">
            <h2 className="section-title">تشكيلتنا المميزة</h2>
            <p className="section-subtitle">اختر عطرك المفضل من بين مجموعتنا الفاخرة</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/store"
              className="ora-btn-secondary"
            >
              عرض جميع العطور
              <FiArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {discountedProducts.length > 0 && (
        <section className="ora-section bg-cream/50">
          <div className="ora-container">
            <div className="text-center mb-12">
              <h2 className="section-title">عروض خاصة</h2>
              <p className="section-subtitle">تخفيضات مميزة على تشكيلة مختارة من العطور</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {discountedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ora-section">
        <div className="ora-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-lg border border-cream hover:border-gold-light transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-dark flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">جودة فاخرة</h3>
              <p className="text-sm text-warm-gray">
                أجود أنواع العطور ومكونات طبيعية مستوردة من أفضل المصادر العالمية
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg border border-cream hover:border-gold-light transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-dark flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">مضمون 100%</h3>
              <p className="text-sm text-warm-gray">
                منتجات أصلية مضمونة. رضاك أولويتنا ونضمن لك الجودة
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg border border-cream hover:border-gold-light transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-dark flex items-center justify-center mx-auto mb-4">
                <FiTruck className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">توصيل سريع</h3>
              <p className="text-sm text-warm-gray">
                توصيل لجميع مدن المغرب في غضون 3-5 أيام عمل
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ora-section bg-black text-white">
        <div className="ora-container text-center">
          <h2 className="section-title" style={{ color: 'var(--gold)' }}>قصة ORA PARFUM</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
          <p className="text-warm-gray max-w-3xl mx-auto leading-relaxed mb-8">
            ORA PARFUM هي علامة تجارية مغربية فاخرة للعطور، تأسست بشغف لتقديم أفضل تجربة عطرية. 
            نستلهم من تراثنا المغربي الغني ونمزجه بأحدث تقنيات صناعة العطور العالمية لنقدم لكم 
            تشكيلة فريدة من العطور التي تعكس شخصيتكم وترتقي بحواسكم.
          </p>
          <Link href="/about" className="ora-btn-gold">
            اكتشف قصتنا
          </Link>
        </div>
      </section>

      <section className="ora-section bg-cream/30">
        <div className="ora-container">
          <div className="text-center mb-12">
            <h2 className="section-title">جديدنا</h2>
            <p className="section-subtitle">أحدث إصداراتنا من العطور الفاخرة</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product, index) => (
              <div
                key={product.id}
                className="slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gold/5">
        <div className="ora-container text-center">
          <h2 className="section-title">تواصل معنا عبر واتساب</h2>
          <p className="section-subtitle">
            هل لديك استفسار؟ نحن هنا لمساعدتك
          </p>
          <a
            href={inquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ora-btn-gold text-lg px-10 py-4 inline-flex items-center gap-3"
          >
            <FaWhatsapp className="w-6 h-6" />
            تواصل معنا عبر واتساب
          </a>
        </div>
      </section>
    </>
  );
}

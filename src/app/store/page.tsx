'use client';

import { useState, useRef, useEffect } from 'react';
import { getProducts } from '@/lib/products';
import { products as seedProducts, categories, genders } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { FiSearch, FiSliders, FiChevronDown, FiX } from 'react-icons/fi';

const sortOptions = [
  { value: '', label: 'الافتراضي' },
  { value: 'price-asc', label: 'السعر: الأقل أولاً' },
  { value: 'price-desc', label: 'السعر: الأعلى أولاً' },
  { value: 'name', label: 'الاسم' },
  { value: 'discount', label: 'التخفيض' },
];

export default function StorePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedGender, setSelectedGender] = useState('الكل');
  const [sortBy, setSortBy] = useState('');
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const [products, setProducts] = useState([...seedProducts]);
  useEffect(() => {
    setProducts(getProducts());
  }, []);
  let filtered = products.filter((p) => p.active);

  if (search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (selectedCategory !== 'الكل') {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  if (selectedGender !== 'الكل') {
    filtered = filtered.filter((p) => p.gender === selectedGender);
  }

  if (showDiscountOnly) {
    filtered = filtered.filter((p) => p.discount && p.discount > 0);
  }

  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
      break;
    case 'discount':
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      break;
  }

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || 'الافتراضي';

  return (
    <>
      <section className="pt-28 pb-16 bg-gradient-to-b from-black to-rich-black">
        <div className="ora-container">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">المتجر</h1>
          <p className="text-warm-gray text-base md:text-lg">اكتشف تشكيلتنا الفاخرة من العطور</p>
        </div>
      </section>

      <section className="bg-white border-b border-cream">
        <div className="ora-container py-6">

          {/* ── DESKTOP LAYOUT (>=1024px): original exactly ── */}
          <div className="hidden lg:flex lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-warm-gray w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن عطر..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ora-search h-14 pr-14 pl-5 text-base"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-14 px-6 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2.5 text-sm font-medium flex-shrink-0 ${
                showFilters
                  ? 'bg-rich-black text-white border-rich-black'
                  : 'bg-ivory text-rich-black border-transparent hover:bg-cream'
              }`}
            >
              <FiSliders className="w-4 h-4" />
              <span>فلترة</span>
            </button>

            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="h-14 px-5 bg-ivory rounded-xl border-0 text-sm font-medium text-rich-black transition-all duration-300 hover:bg-cream flex items-center justify-center gap-2.5 min-w-[140px]"
              >
                <span className="truncate">{currentSortLabel}</span>
                <FiChevronDown className={`w-4 h-4 text-warm-gray transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
              </button>

              {sortOpen && (
                <div className="absolute top-full mt-2 left-0 min-w-[200px] bg-white border border-cream rounded-xl shadow-lg z-20 py-2 overflow-hidden">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                      className={`w-full text-right px-5 py-3 text-sm transition-colors hover:bg-ivory ${
                        sortBy === opt.value ? 'text-gold font-semibold bg-ivory' : 'text-rich-black'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowDiscountOnly(!showDiscountOnly)}
              className={`h-14 px-5 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2.5 text-sm font-medium flex-shrink-0 ${
                showDiscountOnly
                  ? 'bg-gold/10 text-gold-dark border-gold/30'
                  : 'bg-ivory text-rich-black border-transparent hover:bg-cream'
              }`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                showDiscountOnly ? 'border-gold bg-gold' : 'border-warm-gray'
              }`}>
                {showDiscountOnly && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span>العروض فقط</span>
            </button>
          </div>

          {/* ── MOBILE / TABLET LAYOUT (<1024px) ── */}
          <div className="lg:hidden flex flex-col gap-3">
            <div className="relative">
              <FiSearch className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-warm-gray w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="ابحث عن عطر..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ora-search h-10 md:h-12 pr-12 md:pr-14 pl-3 md:pl-5 text-sm md:text-base"
              />
            </div>

            <div className="flex flex-row flex-wrap items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium px-4 ${
                  showFilters
                    ? 'bg-rich-black text-white border-rich-black'
                    : 'bg-ivory text-rich-black border-transparent hover:bg-cream'
                }`}
              >
                <FiSliders className="w-4 h-4" />
                <span>فلترة</span>
                <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="h-10 px-3 bg-ivory rounded-xl border-0 text-sm font-medium text-rich-black transition-all duration-300 hover:bg-cream flex items-center justify-center gap-1.5"
                >
                  <span className="hidden sm:inline truncate max-w-[80px]">{currentSortLabel}</span>
                  <span className="sm:hidden">ترتيب</span>
                  <FiChevronDown className={`w-3.5 h-3.5 text-warm-gray transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
                </button>

                {sortOpen && (
                  <div className="absolute top-full mt-2 right-0 min-w-[180px] bg-white border border-cream rounded-xl shadow-lg z-20 py-2 overflow-hidden">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className={`w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-ivory ${
                          sortBy === opt.value ? 'text-gold font-semibold bg-ivory' : 'text-rich-black'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowDiscountOnly(!showDiscountOnly)}
                className={`hidden md:flex h-10 px-3 rounded-xl border transition-all duration-300 items-center justify-center gap-2 text-sm font-medium ${
                  showDiscountOnly
                    ? 'bg-gold/10 text-gold-dark border-gold/30'
                    : 'bg-ivory text-rich-black border-transparent hover:bg-cream'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                  showDiscountOnly ? 'border-gold bg-gold' : 'border-warm-gray'
                }`}>
                  {showDiscountOnly && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="whitespace-nowrap">العروض فقط</span>
              </button>
            </div>
          </div>

          {/* ── FILTER PANEL (shared) ── */}
          <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="pt-4 border-t border-cream space-y-4">
              <div>
                <span className="text-sm text-warm-gray font-medium block mb-2">التصنيف:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                        selectedCategory === cat
                          ? 'bg-rich-black text-white shadow-sm'
                          : 'bg-ivory text-rich-black hover:bg-cream'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm text-warm-gray font-medium block mb-2">النوع:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {genders.map((gen) => (
                    <button
                      key={gen}
                      onClick={() => setSelectedGender(gen)}
                      className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
                        selectedGender === gen
                          ? 'bg-rich-black text-white shadow-sm'
                          : 'bg-ivory text-rich-black hover:bg-cream'
                      }`}
                    >
                      {gen}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:hidden pt-2 border-t border-cream/60">
                <button
                  onClick={() => setShowDiscountOnly(!showDiscountOnly)}
                  className={`flex items-center gap-2.5 text-sm font-medium transition-colors ${
                    showDiscountOnly ? 'text-gold-dark' : 'text-rich-black'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    showDiscountOnly ? 'border-gold bg-gold' : 'border-warm-gray'
                  }`}>
                    {showDiscountOnly && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span>العروض فقط</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden bg-white/80 border-b border-cream">
        <div className="ora-container py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-rich-black text-white shadow-sm'
                    : 'bg-ivory text-rich-black hover:bg-cream hover:text-rich-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="ora-container">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full bg-ivory-dark flex items-center justify-center mx-auto mb-5">
                <FiSearch className="w-8 h-8 text-warm-gray" />
              </div>
              <p className="text-xl text-warm-gray mb-2">لا توجد منتجات مطابقة للبحث</p>
              <p className="text-sm text-warm-gray/60">حاول تعديل معايير البحث أو الفلترة</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8 pb-5 border-b border-cream">
                <p className="text-sm text-warm-gray">
                  عرض <span className="font-semibold text-rich-black">{filtered.length}</span> {filtered.length === 1 ? 'منتج' : 'منتجات'}
                </p>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-warm-gray">
                  {selectedCategory !== 'الكل' && (
                    <button
                      onClick={() => setSelectedCategory('الكل')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-ivory hover:bg-cream transition-colors"
                    >
                      {selectedCategory}
                      <FiX className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                {filtered.map((product, index) => (
                  <div
                    key={product.id}
                    className="fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

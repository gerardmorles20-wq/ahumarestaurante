/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Flame, SlidersHorizontal, Sparkles, ArrowUpDown, RefreshCw, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';
import { SkeletonLoader } from './SkeletonLoader';

interface MenuViewProps {
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({ onSelectProduct, onQuickAdd }) => {
  const { products, categories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return categories.length > 0 ? categories[0].id : '';
  });
  const [showPromoOnly, setShowPromoOnly] = useState(false);
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc'>('default');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Auto-set category if initialized empty when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories.length, selectedCategory]);

  // Trigger brief simulation of loading on category change or search input
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [selectedCategory, showPromoOnly, showRecommendedOnly, sortBy]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Search term matching (name, category description, ingredients)
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.ingredients && p.ingredients.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase())));

    // Category matching
    const matchesCategory = selectedCategory === 'all' || !selectedCategory || p.category === selectedCategory;

    // Promo filtering
    const matchesPromo = !showPromoOnly || p.isPromo || p.tags?.some((t) => t.toLowerCase().includes('promoc'));

    // Recommended filtering
    const matchesRec = !showRecommendedOnly || p.isRecommended;

    return matchesSearch && matchesCategory && matchesPromo && matchesRec;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    // Default sorting (put in-stock items first, then recommended, then by ID)
    if (a.isOutOfStock && !b.isOutOfStock) return 1;
    if (!a.isOutOfStock && b.isOutOfStock) return -1;
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    return 0;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(categories[0]?.id || '');
    setShowPromoOnly(false);
    setShowRecommendedOnly(false);
    setSortBy('default');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0D0D0D] flex flex-col text-left">
      {/* Search Bar Section */}
      <div className="px-5 pt-4 pb-3 sticky top-0 bg-[#0D0D0D]/95 backdrop-blur-md z-20 space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por carne, hamburguesas, acompañante..."
            className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/30 outline-none transition-all shadow-inner"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-white/40" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-2.5 text-white/60 bg-white/10 hover:text-white text-[10px] px-1.5 py-0.5 rounded-md"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Category horizontal slider bento layout */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x select-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wide shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#FF5A20] text-[#0D0D0D] shadow-md shadow-[#FF5A20]/10 border border-[#FF5A20]'
                  : 'bg-[#161616] text-white/60 border border-white/5 hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Quick filters toggle block */}
        <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
              showFilters || showPromoOnly || showRecommendedOnly || sortBy !== 'default'
                ? 'text-[#FF5A20]'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <SlidersHorizontal size={12} />
            Filtros Avanzados
          </button>

          {(showPromoOnly || showRecommendedOnly || sortBy !== 'default' || (categories.length > 0 && selectedCategory !== categories[0].id)) && (
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-white/40 hover:text-red-400 font-bold flex items-center gap-1 transition-all"
            >
              <RefreshCw size={10} />
              Limpiar
            </button>
          )}
        </div>

        {/* Expanded Filters Section */}
        {showFilters && (
          <div className="bg-[#161616]/45 border border-white/5 p-3.5 rounded-2xl grid grid-cols-2 gap-3.5 animate-[fadeIn_0.2s_ease-out]">
            {/* Sorting */}
            <div className="col-span-2 space-y-1.5">
              <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Ordenar por:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setSortBy('default')}
                  className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                    sortBy === 'default'
                      ? 'bg-white/10 border-[#FF5A20]/40 text-[#FF5A20]'
                      : 'bg-[#0D0D0D] border-white/5 text-white/60'
                  }`}
                >
                  Predeterminado
                </button>
                <button
                  onClick={() => setSortBy('priceAsc')}
                  className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                    sortBy === 'priceAsc'
                      ? 'bg-white/10 border-[#FF5A20]/40 text-[#FF5A20]'
                      : 'bg-[#0D0D0D] border-white/5 text-white/60'
                  }`}
                >
                  Menor Precio
                </button>
                <button
                  onClick={() => setSortBy('priceDesc')}
                  className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                    sortBy === 'priceDesc'
                      ? 'bg-white/10 border-[#FF5A20]/40 text-[#FF5A20]'
                      : 'bg-[#0D0D0D] border-white/5 text-white/60'
                  }`}
                >
                  Mayor Precio
                </button>
              </div>
            </div>

            {/* Quick Badges */}
            <button
              onClick={() => setShowPromoOnly(!showPromoOnly)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all ${
                showPromoOnly
                  ? 'bg-red-950/20 border-red-500 text-red-400'
                  : 'bg-[#0D0D0D] border-white/5 text-white/60 hover:text-white'
              }`}
            >
              <Flame size={12} className={showPromoOnly ? 'text-red-500' : ''} />
              Promociones
            </button>

            <button
              onClick={() => setShowRecommendedOnly(!showRecommendedOnly)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all ${
                showRecommendedOnly
                  ? 'bg-amber-950/20 border-[#FF5A20] text-amber-400'
                  : 'bg-[#0D0D0D] border-white/5 text-white/60 hover:text-white'
              }`}
            >
              <Sparkles size={12} className={showRecommendedOnly ? 'text-[#FF5A20]' : ''} />
              Recomendados
            </button>
          </div>
        )}
      </div>

      {/* Product Grid Area */}
      <div className="flex-1 px-5 pb-6">
        {loading ? (
          <SkeletonLoader />
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5">
            {sortedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#161616] border border-white/5 flex items-center justify-center text-white/40">
              <Search size={24} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">No se encontraron productos</h3>
              <p className="text-[11px] text-white/40 max-w-xs mt-1">
                Intenta buscando otra palabra o resetea los filtros para ver el menú completo.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="mt-2 text-xs bg-[#161616] hover:bg-white/5 border border-white/10 text-[#FF5A20] font-extrabold px-4 py-2 rounded-xl transition-all"
            >
              Ver menú completo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

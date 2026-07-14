/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Flame, Sparkles, Award, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onQuickAdd }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format price helper (Colombian Peso style)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTagStyle = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('nuevo')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (t.includes('picante')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (t.includes('estrella') || t.includes('recomendado') || t.includes('premium')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    return 'bg-stone-800 text-stone-300 border-stone-700/60';
  };

  const getTagIcon = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('nuevo')) return <Sparkles size={10} className="mr-1 inline" />;
    if (t.includes('picante')) return <Flame size={10} className="mr-1 inline text-red-500" />;
    if (t.includes('estrella') || t.includes('recomendado') || t.includes('premium')) {
      return <Award size={10} className="mr-1 inline text-amber-500" />;
    }
    return null;
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className={`group bg-[#161616] border border-white/5 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:border-[#FF5A20]/30 hover:shadow-[#FF5A20]/5 hover:-translate-y-0.5 flex flex-col h-full cursor-pointer relative ${
        product.isOutOfStock ? 'opacity-65' : ''
      }`}
    >
      {/* Product Image */}
      <div className="w-full aspect-[4/3] bg-[#0D0D0D] relative overflow-hidden shrink-0">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#161616] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#FF5A20] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={product.imageUrl}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Floating Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
            {product.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border backdrop-blur-sm shadow-sm ${getTagStyle(
                  tag
                )}`}
              >
                {getTagIcon(tag)}
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-[#0D0D0D]/90 text-red-500 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-red-900/30">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white group-hover:text-[#FF5A20] transition-colors tracking-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed min-h-[32px]">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to cart button */}
        <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#FF5A20]">
              {formatPrice(product.price)}
            </span>
          </div>

          {!product.isOutOfStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // If it has accompaniments, let's open the selection modal instead of direct add
                if (product.accompanimentsCount && product.accompanimentsCount > 0) {
                  onSelect(product);
                } else {
                  onQuickAdd(product);
                }
              }}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-[#FF5A20] border border-white/10 hover:border-[#FF5A20] text-white/80 hover:text-[#0D0D0D] flex items-center justify-center transition-all active:scale-90 shadow-md"
              title="Agregar al carrito"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

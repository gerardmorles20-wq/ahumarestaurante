/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { DEFAULT_ACCOMPANIMENTS } from '../data';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, notes: string, accompaniments: string[]) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedAccompaniments, setSelectedAccompaniments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reqAccompaniments = product.accompanimentsCount || 0;

  // Format price helper (Colombian Peso style)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleToggleAccompaniment = (item: string) => {
    setError(null);
    setSelectedAccompaniments((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      }
      if (prev.length >= reqAccompaniments) {
        // Swap or ignore
        return [...prev.slice(1), item];
      }
      return [...prev, item];
    });
  };

  const handleAdd = () => {
    if (reqAccompaniments > 0 && selectedAccompaniments.length !== reqAccompaniments) {
      setError(`Por favor selecciona exactamente ${reqAccompaniments} acompañantes para este corte.`);
      return;
    }
    onAddToCart(product, quantity, notes, selectedAccompaniments);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-xs select-none">
      {/* Tap outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>

      {/* Slide-up Container */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="bg-[#161616] border-t border-white/10 rounded-t-[32px] overflow-hidden flex flex-col max-h-[85%] shadow-[0_-15px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Modal Handle */}
        <div className="w-full flex justify-center py-2 shrink-0 bg-[#161616]/90 border-b border-white/5">
          <div className="w-12 h-1 bg-stone-700 rounded-full"></div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-5 pb-6 space-y-5">
          {/* Main Photo Banner */}
          <div className="w-full aspect-[16/10] bg-[#0D0D0D] rounded-2xl overflow-hidden relative mt-2 shrink-0 shadow-md">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white flex items-center justify-center border border-white/10 backdrop-blur-sm transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Title & Price */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h1>
              <span className="text-lg font-black text-[#FF5A20] shrink-0">
                {formatPrice(product.price * quantity)}
              </span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Ingredients list if present */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">
                Ingredientes Incluidos:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-white/5 border border-white/10 text-white/80 px-2.5 py-1 rounded-lg"
                  >
                    • {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Accompaniments Selector if required */}
          {reqAccompaniments > 0 && (
            <div className="space-y-3 p-4 bg-[#0D0D0D]/40 border border-white/5 rounded-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">
                  Selecciona Acompañantes:
                </h4>
                <span className="text-[10px] font-bold text-[#FF5A20] font-mono">
                  {selectedAccompaniments.length} de {reqAccompaniments}
                </span>
              </div>
              <p className="text-[10px] text-white/40">
                Selecciona los {reqAccompaniments} acompañantes de tu preferencia de la siguiente lista:
              </p>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-950/10 border border-red-900/20 p-2.5 rounded-xl text-[11px] font-medium">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2">
                {DEFAULT_ACCOMPANIMENTS.map((side) => {
                  const isSelected = selectedAccompaniments.includes(side);
                  return (
                    <button
                      key={side}
                      type="button"
                      onClick={() => handleToggleAccompaniment(side)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all text-left ${
                        isSelected
                          ? 'bg-[#FF5A20]/10 border-[#FF5A20] text-[#FF5A20]'
                          : 'bg-[#161616] border border-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      <span>{side}</span>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#FF5A20] border-[#FF5A20] text-[#0D0D0D]'
                            : 'border-white/20'
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observations notes field */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-white/40 tracking-wider">
              Observaciones del Chef:
            </h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Término 3/4 para la carne, sin cebolla, salsas aparte..."
              className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl p-3 text-xs text-white placeholder:text-white/30 outline-none transition-all h-20 resize-none font-sans"
            ></textarea>
          </div>

          {/* Bottom quantity selector & add button */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4 shrink-0">
            {/* Quantity Controls */}
            <div className="flex items-center bg-[#0D0D0D] border border-white/5 rounded-xl p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-[#161616] transition-colors active:scale-90"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-xs font-black text-white font-mono">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-[#161616] transition-colors active:scale-90"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              className="flex-1 bg-gradient-to-r from-[#FF5A20] to-amber-600 hover:from-amber-600 hover:to-[#FF5A20] text-[#0D0D0D] font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg shadow-[#FF5A20]/10 flex items-center justify-center gap-2 hover:shadow-[#FF5A20]/20 active:scale-98 transition-all"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

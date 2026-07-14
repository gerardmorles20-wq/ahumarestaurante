/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Share2, MapPin, Clock, Star, Flame, ChevronRight, Compass, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface HomeViewProps {
  onNavigateToMenu: () => void;
  onSelectProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateToMenu, onSelectProduct }) => {
  const { restaurantInfo, products, clearCart, updateOrderDetails } = useStore();
  const [copied, setCopied] = useState(false);
  const [showTrashConfirm, setShowTrashConfirm] = useState(false);

  const renderStylizedName = (name: string) => {
    const parts = name.split(' ');
    if (parts[0].toUpperCase() === 'AHUMA' || parts[0].toUpperCase() === 'AHÚMA') {
      return (
        <>
          <span className="text-[#FF5A20]">AHÚMA</span>{' '}
          {parts.slice(1).join(' ').toUpperCase()}
        </>
      );
    }
    return name.toUpperCase();
  };

  // Filter out recommended products to display as highlights
  const recommendedProducts = products.filter((p) => p.isRecommended && !p.isOutOfStock).slice(0, 3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = () => {
    const shareData = {
      title: restaurantInfo.name,
      text: restaurantInfo.description,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0D0D0D] pb-8 relative">
      {/* Dynamic Toast for Sharing */}
      {copied && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#FF5A20] text-[#0D0D0D] px-4 py-2 rounded-full text-xs font-black tracking-wide shadow-lg border border-[#FF5A20]/30 z-50 flex items-center gap-1.5 animate-bounce">
          <Star size={14} className="fill-current" />
          ¡Enlace copiado al portapapeles!
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative w-full aspect-[16/9] bg-[#161616] overflow-hidden shrink-0 shadow-md">
        <img
          src={restaurantInfo.bannerUrl}
          alt={restaurantInfo.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-[0.4]"
        />
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent"></div>

        {/* Floating Rating */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
          <Star size={12} className="text-[#FF5A20] fill-current" />
          <span className="text-[11px] font-black text-white/90 font-mono">{restaurantInfo.rating}</span>
        </div>
      </div>

      {/* Logo & Intro Brand Frame */}
      <div className="px-5 -mt-10 relative z-10 flex flex-col items-center text-center">
        {/* Customized Stylized SVG Emblem */}
        <div className="w-20 h-20 bg-[#161616] border-2 border-[#FF5A20] rounded-3xl flex items-center justify-center shadow-xl shadow-black/80 relative">
          <div className="absolute inset-0.5 rounded-2xl bg-[#0D0D0D] flex flex-col items-center justify-center p-1 border border-white/10 overflow-hidden">
            {restaurantInfo.logoUrl ? (
              <img
                src={restaurantInfo.logoUrl}
                alt={restaurantInfo.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <svg className="w-13 h-13 text-[#FF5A20] fill-current" viewBox="0 0 100 100">
                {/* Flame aura background */}
                <path d="M50 8 C50 8, 32 25, 32 45 C32 55, 40 65, 50 65 C60 65, 68 55, 68 45 C68 25, 50 8, 50 8 Z" className="opacity-10" />
                <path d="M50 16 C50 16, 36 32, 36 48 C36 56, 42 62, 50 62 C58 62, 64 56, 64 48 C64 32, 50 16, 50 16 Z" className="opacity-20" />
                
                {/* Bull Head Horns */}
                <path d="M22 28 C15 15, 30 5, 42 16 C34 16, 25 22, 28 32 C29 35, 33 38, 35 40 C31 38, 25 34, 22 28 Z" />
                <path d="M78 28 C85 15, 70 5, 58 16 C66 16, 75 22, 72 32 C71 35, 67 38, 65 40 C69 38, 75 34, 78 28 Z" />
                
                {/* Skull center & muzzle */}
                <path d="M35 40 L65 40 L58 55 L50 78 L42 55 Z" />
                
                {/* Eyes/Slots */}
                <path d="M43 45 L48 48 L46 51 Z" fill="#0D0D0D" />
                <path d="M57 45 L52 48 L54 51 Z" fill="#0D0D0D" />
                
                {/* Forehead Flame Detail */}
                <path d="M50 25 C47 32, 53 38, 50 48 C53 45, 55 41, 53 35 C52 31, 51 28, 50 25 Z" fill="#0D0D0D" />
              </svg>
            )}
          </div>
        </div>


        <h1 className="text-3xl font-extrabold text-white uppercase tracking-widest mt-4 mb-1 font-dela">
          AHÚMA
        </h1>
        <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FF5A20] mb-3">
          STEAK HOUSE
        </span>
        <p className="text-xs text-white/60 max-w-sm leading-relaxed px-2">
          {restaurantInfo.description}
        </p>
      </div>

      {/* Action Button Strip */}
      <div className={`grid gap-2.5 px-5 py-6 ${restaurantInfo.showHomeTrashButton ? 'grid-cols-5' : 'grid-cols-4'}`}>
        <a
          href={restaurantInfo.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center p-2.5 bg-[#161616] border border-white/5 hover:border-[#FF5A20]/20 rounded-2xl group transition-all text-white/80"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0D0D0D] border border-white/10 flex items-center justify-center group-hover:text-[#FF5A20] transition-colors">
            <MapPin size={16} />
          </div>
          <span className="text-[10px] font-bold mt-1.5 text-center leading-none">Cómo llegar</span>
        </a>

        <a
          href={`tel:${restaurantInfo.phone}`}
          className="flex flex-col items-center justify-center p-2.5 bg-[#161616] border border-white/5 hover:border-[#FF5A20]/20 rounded-2xl group transition-all text-white/80"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0D0D0D] border border-white/10 flex items-center justify-center group-hover:text-[#FF5A20] transition-colors">
            <Phone size={16} />
          </div>
          <span className="text-[10px] font-bold mt-1.5 text-center leading-none">Llamar</span>
        </a>

        <a
          href={`https://wa.me/57${restaurantInfo.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center p-2.5 bg-[#161616] border border-white/5 hover:border-[#FF5A20]/20 rounded-2xl group transition-all text-white/80"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0D0D0D] border border-white/10 flex items-center justify-center group-hover:text-[#FF5A20] transition-colors">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.166.001 6.141 1.233 8.377 3.469 2.235 2.237 3.465 5.213 3.464 8.379-.003 6.535-5.328 11.859-11.859 11.859-1.996-.001-3.956-.503-5.69-1.46L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.437-.002 9.861-4.427 9.864-9.864.001-2.63-1.02-5.103-2.876-6.96C16.485 1.924 14.015.903 11.39.902c-5.438 0-9.863 4.426-9.865 9.865-.001 1.636.438 3.235 1.272 4.64L1.75 21.6l6.402-1.68c1.393.762 2.946 1.164 4.495 1.166z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold mt-1.5 text-center leading-none">WhatsApp</span>
        </a>

        <button
          onClick={handleShare}
          className="flex flex-col items-center justify-center p-2.5 bg-[#161616] border border-white/5 hover:border-[#FF5A20]/20 rounded-2xl group transition-all text-white/80"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0D0D0D] border border-white/10 flex items-center justify-center group-hover:text-[#FF5A20] transition-colors">
            <Share2 size={16} />
          </div>
          <span className="text-[10px] font-bold mt-1.5 text-center leading-none">Compartir</span>
        </button>

        {restaurantInfo.showHomeTrashButton && (
          <button
            onClick={() => setShowTrashConfirm(true)}
            className="flex flex-col items-center justify-center p-2.5 bg-[#161616] border border-white/5 hover:border-red-500/20 rounded-2xl group transition-all text-white/80"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0D0D0D] border border-white/10 flex items-center justify-center group-hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </div>
            <span className="text-[10px] font-bold mt-1.5 text-center leading-none truncate w-full">
              {restaurantInfo.homeTrashButtonText || 'Vaciar'}
            </span>
          </button>
        )}
      </div>

      {/* Schedule & Address quick cards */}
      <div className="px-5 space-y-2.5">
        <div className="flex items-center gap-3.5 p-3.5 bg-[#161616]/60 border border-white/5 rounded-2xl">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A20]/10 flex items-center justify-center text-[#FF5A20] shrink-0">
            <Clock size={16} />
          </div>
          <div className="text-left">
            <h4 className="text-[10px] font-black uppercase text-white/40 tracking-wider">Horario de Atención</h4>
            <p className="text-xs text-white font-semibold">{restaurantInfo.schedule}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3.5 bg-[#161616]/60 border border-white/5 rounded-2xl">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A20]/10 flex items-center justify-center text-[#FF5A20] shrink-0">
            <MapPin size={16} />
          </div>
          <div className="text-left">
            <h4 className="text-[10px] font-black uppercase text-white/40 tracking-wider">Nuestra Ubicación</h4>
            <p className="text-xs text-white font-semibold">{restaurantInfo.address}, {restaurantInfo.neighborhood}</p>
          </div>
        </div>
      </div>

      {/* Recommended Products Bento Slider */}
      <div className="mt-8 space-y-4 text-left">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-1.5">
            <Flame size={16} className="text-red-500 fill-current animate-pulse" />
            <h3 className="text-xs font-normal uppercase text-white/80 tracking-wide font-dela">
              Platos Recomendados
            </h3>
          </div>
          <button
            onClick={onNavigateToMenu}
            className="text-[11px] font-bold text-[#FF5A20] flex items-center gap-1 hover:underline focus:outline-none"
          >
            Ver Todo
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Carousel of recommended products */}
        <div className="flex overflow-x-auto gap-4 px-5 pb-2 scrollbar-none snap-x snap-mandatory">
          {recommendedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className="w-48 bg-[#161616] border border-white/5 rounded-2xl overflow-hidden shrink-0 snap-start cursor-pointer hover:border-[#FF5A20]/20 shadow-md group transition-all"
            >
              <div className="w-full aspect-video bg-[#0D0D0D] overflow-hidden relative">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3 space-y-1.5 text-left">
                <h4 className="text-xs font-black text-white truncate group-hover:text-[#FF5A20] transition-colors">
                  {p.name}
                </h4>
                <p className="text-[10px] text-white/60 line-clamp-1">
                  {p.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-[#FF5A20] font-mono">
                    {formatPrice(p.price)}
                  </span>
                  <span className="text-[9px] bg-red-950/40 text-red-400 font-black px-1.5 py-0.5 rounded-md border border-red-900/10 uppercase font-mono scale-90">
                    Estrella
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action to menu */}
      <div className="px-5 mt-8 shrink-0">
        <button
          onClick={onNavigateToMenu}
          className="w-full bg-gradient-to-r from-[#FF5A20] to-amber-600 hover:from-amber-600 hover:to-[#FF5A20] text-[#0D0D0D] py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg shadow-[#FF5A20]/10 hover:shadow-[#FF5A20]/25 active:scale-98 transition-all"
        >
          <Compass size={16} />
          Explorar el Menú Completo
        </button>
      </div>

      {/* Confirmation Modal overlay for Trash button */}
      {showTrashConfirm && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#161616] border border-white/10 rounded-3xl p-5 w-full max-w-xs text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
              <Trash2 size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                ¿Confirmar Eliminación?
              </h3>
              <p className="text-[11px] text-white/60 leading-normal">
                {restaurantInfo.homeTrashButtonAction === 'clear_all'
                  ? 'Se vaciará por completo tu carrito de compras y tus datos de envío.'
                  : 'Se vaciarán todos los productos agregados a tu pedido.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowTrashConfirm(false)}
                className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-xl font-bold text-[11px] transition-all uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (restaurantInfo.homeTrashButtonAction === 'clear_all') {
                    clearCart();
                    updateOrderDetails({
                      name: '',
                      surname: '',
                      phone: '',
                      address: '',
                      neighborhood: '',
                      apartment: '',
                      tower: '',
                      floor: '',
                      observations: '',
                    });
                  } else {
                    clearCart();
                  }
                  setShowTrashConfirm(false);
                }}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-[11px] transition-all uppercase tracking-wider"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

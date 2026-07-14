/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  currentView: string;
  onBack?: () => void;
  onNavigateToCart?: () => void;
  onLogoSecretTrigger?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onBack,
  onNavigateToCart,
  onLogoSecretTrigger,
}) => {
  const { cart, restaurantInfo } = useStore();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const clickCountRef = React.useRef(0);
  const lastClickTimeRef = React.useRef(0);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 2000) {
      clickCountRef.current += 1;
      if (clickCountRef.current >= 5) {
        onLogoSecretTrigger?.();
        clickCountRef.current = 0;
      }
    } else {
      clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;
  };

  // Get localized titles for header
  const getTitle = () => {
    switch (currentView) {
      case 'home':
        return '';
      case 'menu':
        return 'Nuestro Menú';
      case 'cart':
        return 'Tu Pedido';
      case 'info':
        return 'Nosotros';
      case 'admin':
        return 'Panel Admin';
      default:
        return restaurantInfo.name;
    }
  };

  const getLogoText = () => {
    const firstWord = restaurantInfo.name.split(' ')[0].toUpperCase();
    if (firstWord === 'AHUMA' || firstWord === 'AHÚMA') {
      return 'AHÚMA';
    }
    return firstWord;
  };

  return (
    <header className="bg-[#0D0D0D] border-b border-white/10 h-14 px-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Left section: back button or logo */}
      <div className="flex items-center gap-2">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <button
            onClick={handleLogoClick}
            type="button"
            className="flex items-center gap-1.5 focus:outline-none select-none active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6 text-[#FF5A20] fill-current" viewBox="0 0 100 100">
              <path d="M22 28 C15 15, 30 5, 42 16 C34 16, 25 22, 28 32 C29 35, 33 38, 35 40 C31 38, 25 34, 22 28 Z" />
              <path d="M78 28 C85 15, 70 5, 58 16 C66 16, 75 22, 72 32 C71 35, 67 38, 65 40 C69 38, 75 34, 78 28 Z" />
              <path d="M35 40 L65 40 L58 55 L50 78 L42 55 Z" />
              <path d="M43 45 L48 48 L46 51 Z" fill="#0D0D0D" />
              <path d="M57 45 L52 48 L54 51 Z" fill="#0D0D0D" />
              <path d="M50 25 C47 32, 53 38, 50 48 C53 45, 55 41, 53 35 C52 31, 51 28, 50 25 Z" fill="#0D0D0D" />
            </svg>
            <span className="text-sm font-medium tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A20] via-[#FF7E40] to-[#FF5A20] font-dela">
              {getLogoText()}
            </span>
          </button>
        )}
      </div>

      {/* Center title */}
      <h2 className="text-xs font-normal text-white uppercase tracking-wider text-center flex-1 truncate font-dela">
        {onBack ? '' : getTitle()}
      </h2>

      {/* Right Section: Shopping Cart shortcut */}
      <div className="flex items-center justify-end w-9">
        {currentView !== 'cart' && onNavigateToCart && (
          <button
            onClick={onNavigateToCart}
            className="relative w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-[#FF5A20] transition-all active:scale-95 hover:border-[#FF5A20]/20"
          >
            <ShoppingBag size={18} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#0D0D0D] animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

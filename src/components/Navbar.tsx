/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Compass, ShoppingCart, Info, ShieldAlert } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  currentView: 'home' | 'menu' | 'cart' | 'info' | 'admin';
  setCurrentView: (view: 'home' | 'menu' | 'cart' | 'info' | 'admin') => void;
  isAdminModeUnlocked?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  isAdminModeUnlocked,
}) => {
  const { cart } = useStore();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  interface TabItem {
    id: 'home' | 'menu' | 'cart' | 'info' | 'admin';
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'menu', label: 'Menú', icon: Compass },
    { id: 'cart', label: 'Carrito', icon: ShoppingCart, badge: cartItemCount },
    { id: 'info', label: 'Info', icon: Info },
    ...(isAdminModeUnlocked ? [{ id: 'admin', label: 'Admin', icon: ShieldAlert } as TabItem] : []),
  ];

  return (
    <nav className="bg-[#161616] border-t border-white/10 px-4 py-2 sticky bottom-0 z-40 shadow-xl">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 relative group focus:outline-none transition-colors"
            >
              {/* Active Glow/Underlay */}
              {isActive && (
                <span className="absolute -top-2 w-12 h-[3px] bg-[#FF5A20] rounded-full animate-pulse"></span>
              )}

              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'text-[#FF5A20] scale-110 drop-shadow-[0_0_10px_rgba(255,90,32,0.4)]'
                      : 'text-white/60 group-hover:text-white/80'
                  }`}
                />

                {/* Shopping Cart Badge */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#0D0D0D] animate-bounce">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 font-medium tracking-wide transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-white/40 group-hover:text-white/60'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

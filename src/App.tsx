/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { PhoneContainer } from './components/PhoneContainer';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { CartView } from './components/CartView';
import { InfoView } from './components/InfoView';
import { AdminPanel } from './components/AdminPanel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Product } from './types';
import { ShoppingCart, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'cart' | 'info' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdminModeUnlocked, setIsAdminModeUnlocked] = useState(() => {
    return localStorage.getItem('ahuma_admin_unlocked') === 'true';
  });

  const { addToCart } = useStore();

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1);
    triggerToast(`¡${product.name} agregado al carrito!`);
  };

  const handleModalAddToCart = (product: Product, quantity: number, notes: string, accompaniments: string[]) => {
    addToCart(product, quantity, notes, accompaniments);
    setSelectedProduct(null);
    triggerToast(`¡${quantity} x ${product.name} agregado al carrito!`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Determine back navigation handler if on detail screen or sub-actions
  const handleBack = selectedProduct ? () => setSelectedProduct(null) : undefined;

  return (
    <PhoneContainer>
      {/* Top Header */}
      <Header
        currentView={currentView}
        onBack={handleBack}
        onNavigateToCart={() => setCurrentView('cart')}
        onLogoSecretTrigger={() => {
          if (isAdminModeUnlocked) {
            setIsAdminModeUnlocked(false);
            localStorage.removeItem('ahuma_admin_unlocked');
            sessionStorage.removeItem('ahuma_admin_auth');
            sessionStorage.removeItem('ahuma_current_admin_email');
            if (currentView === 'admin') {
              setCurrentView('home');
            }
            triggerToast('🔒 Acceso de administrador ocultado.');
          } else {
            setIsAdminModeUnlocked(true);
            localStorage.setItem('ahuma_admin_unlocked', 'true');
            setCurrentView('admin');
            triggerToast('🔐 ¡Acceso de administrador activado!');
          }
        }}
      />

      {/* Main Reactive Screen Views */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {selectedProduct ? (
            <ProductDetailModal
              key="detail"
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={handleModalAddToCart}
            />
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {currentView === 'home' && (
                <HomeView
                  onNavigateToMenu={() => setCurrentView('menu')}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              )}
              {currentView === 'menu' && (
                <MenuView
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onQuickAdd={handleQuickAdd}
                />
              )}
              {currentView === 'cart' && <CartView />}
              {currentView === 'info' && <InfoView />}
              {currentView === 'admin' && (
                <AdminPanel
                  onLockAdmin={() => {
                    setIsAdminModeUnlocked(false);
                    localStorage.removeItem('ahuma_admin_unlocked');
                    setCurrentView('home');
                    triggerToast('🔒 Panel de administración ocultado.');
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Flying Adding-to-Cart Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -45, scale: 0.92 }}
              animate={{ opacity: 1, y: 15, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.95 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 font-black text-xs px-4 py-2.5 rounded-full shadow-lg border border-amber-400 z-50 flex items-center gap-2 max-w-[85%] whitespace-nowrap overflow-hidden"
            >
              <div className="w-5 h-5 rounded-full bg-stone-950 flex items-center justify-center text-amber-500 shrink-0">
                <Check size={11} strokeWidth={3} />
              </div>
              <span className="truncate">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Tab Bar */}
      {!selectedProduct && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isAdminModeUnlocked={isAdminModeUnlocked}
        />
      )}
    </PhoneContainer>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

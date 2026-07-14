/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, User, Phone, MapPin, Building, Clipboard, MessageSquare, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderDetails } from '../types';

export const CartView: React.FC = () => {
  const { cart, restaurantInfo, orderDetails, updateQuantity, removeFromCart, updateOrderDetails, clearCart } = useStore();
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof OrderDetails, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subtotal Calculation
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? restaurantInfo.deliveryCost : 0;
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (field: keyof OrderDetails, value: string) => {
    updateOrderDetails({ [field]: value });
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof OrderDetails, string>> = {};
    if (!orderDetails.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!orderDetails.surname.trim()) errors.surname = 'El apellido es obligatorio.';
    if (!orderDetails.phone.trim()) {
      errors.phone = 'El teléfono es obligatorio.';
    } else if (!/^\d{7,10}$/.test(orderDetails.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Introduce un teléfono válido (7 a 10 dígitos).';
    }
    if (!orderDetails.address.trim()) errors.address = 'La dirección es obligatoria.';
    if (!orderDetails.neighborhood.trim()) errors.neighborhood = 'El barrio es obligatorio.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Find first error and scroll to it
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Build the order list text
    const orderItemsText = cart
      .map((item) => {
        const accompanimentList = item.selectedAccompaniments && item.selectedAccompaniments.length > 0
          ? ` (Con: ${item.selectedAccompaniments.join(', ')})`
          : '';
        const itemNote = item.notes ? ` [Nota: ${item.notes}]` : '';
        return `* ${item.quantity} x ${item.product.name}${accompanimentList}${itemNote}`;
      })
      .join('\n');

    // Apartment details helper
    const appDetails = [
      orderDetails.apartment ? `Apto: ${orderDetails.apartment}` : '',
      orderDetails.tower ? `Torre: ${orderDetails.tower}` : '',
      orderDetails.floor ? `Piso: ${orderDetails.floor}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    const completeAddress = `${orderDetails.address}${appDetails ? ` (${appDetails})` : ''}`;

    // Generate WhatsApp text message matching the prompt requirements exactly
    const message = `🍖 *NUEVO PEDIDO - AHUMA RESTAURANTE*

*Cliente:*
* Nombre: ${orderDetails.name} ${orderDetails.surname}
* Teléfono: ${orderDetails.phone}
* Dirección: ${completeAddress}
* Barrio: ${orderDetails.neighborhood}

*Pedido:*
${orderItemsText}

*Observaciones generales:*
${orderDetails.observations || 'Ninguna'}

*Detalle de Cuenta:*
* Subtotal: ${formatPrice(subtotal)}
* Domicilio: ${formatPrice(deliveryFee)}
* *TOTAL: ${formatPrice(total)}*

Muchas gracias.`;

    // Encode text to URI
    const encodedText = encodeURIComponent(message);
    const waNumber = restaurantInfo.whatsapp.replace(/\s+/g, '');
    const whatsappUrl = `https://wa.me/57${waNumber}?text=${encodedText}`;

    // Open WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
      clearCart(); // Clean cart upon success
    }, 800);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0D0D0D] flex flex-col text-left">
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 py-20 gap-4">
          <div className="w-16 h-16 rounded-full bg-[#161616] border border-white/5 flex items-center justify-center text-white/40 animate-pulse">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Tu carrito está vacío</h3>
            <p className="text-[11px] text-white/40 max-w-xs mt-1 leading-relaxed">
              Explora nuestro menú premium y agrega tus cortes preferidos al carrito para realizar tu pedido por WhatsApp.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder} className="flex-1 flex flex-col">
          {/* Cart Items List */}
          <div className="px-5 py-4 space-y-3 shrink-0">
            <h3 className="text-xs font-black uppercase text-white/40 tracking-wider">
              Resumen de Productos ({cart.length})
            </h3>

            <div className="space-y-2.5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#161616] border border-white/5 rounded-2xl p-3 flex gap-3.5 relative overflow-hidden group shadow-md"
                >
                  <div className="w-16 h-16 bg-[#0D0D0D] rounded-xl overflow-hidden shrink-0 shadow-inner">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                    <div>
                      <h4 className="text-xs font-black text-white truncate">
                        {item.product.name}
                      </h4>
                      {/* Accompaniments if chosen */}
                      {item.selectedAccompaniments && item.selectedAccompaniments.length > 0 && (
                        <p className="text-[10px] text-[#FF5A20]/80 font-medium mt-0.5 line-clamp-1">
                          Acomp: {item.selectedAccompaniments.join(', ')}
                        </p>
                      )}
                      {/* Individual Notes if present */}
                      {item.notes && (
                        <p className="text-[10px] text-white/40 italic mt-0.5 truncate">
                          Nota: "{item.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-[#FF5A20] font-mono">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>

                      {/* Quantity Increments */}
                      <div className="flex items-center bg-[#0D0D0D] border border-white/5 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-[#161616] transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center text-[10px] font-black text-white/80 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-[#161616] transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Trash delete button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2.5 right-2.5 text-white/30 hover:text-red-400 p-1 rounded-lg transition-colors focus:outline-none"
                    title="Eliminar del pedido"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Address & Info Form */}
          <div className="px-5 py-4 space-y-4 border-t border-white/5 bg-[#161616]/40">
            <h3 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5">
              <MapPin size={14} className="text-[#FF5A20]" />
              Datos de Envío (Domicilio)
            </h3>

            <div className="space-y-3.5">
              {/* Name & Surname side-by-side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1" data-error={!!formErrors.name}>
                  <label className="text-[10px] font-black uppercase text-white/60 tracking-wider flex items-center gap-1">
                    <User size={11} className="text-white/40" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={orderDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej. Juan"
                    className={`w-full bg-[#161616] border ${
                      formErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FF5A20]'
                    } rounded-xl py-2 px-3 text-xs text-white outline-none transition-all placeholder:text-white/20`}
                  />
                  {formErrors.name && (
                    <span className="text-[9px] text-red-400 font-bold block">{formErrors.name}</span>
                  )}
                </div>

                <div className="space-y-1" data-error={!!formErrors.surname}>
                  <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={orderDetails.surname}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                    placeholder="Ej. Pérez"
                    className={`w-full bg-[#161616] border ${
                      formErrors.surname ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FF5A20]'
                    } rounded-xl py-2 px-3 text-xs text-white outline-none transition-all placeholder:text-white/20`}
                  />
                  {formErrors.surname && (
                    <span className="text-[9px] text-red-400 font-bold block">{formErrors.surname}</span>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1" data-error={!!formErrors.phone}>
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider flex items-center gap-1">
                  <Phone size={11} className="text-white/40" />
                  Teléfono Móvil *
                </label>
                <input
                  type="tel"
                  value={orderDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ej. 3042300570"
                  className={`w-full bg-[#161616] border ${
                    formErrors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FF5A20]'
                  } rounded-xl py-2 px-3 text-xs text-white outline-none transition-all placeholder:text-white/20`}
                />
                {formErrors.phone && (
                  <span className="text-[9px] text-red-400 font-bold block">{formErrors.phone}</span>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1" data-error={!!formErrors.address}>
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider flex items-center gap-1">
                  <MapPin size={11} className="text-white/40" />
                  Dirección de Entrega *
                </label>
                <input
                  type="text"
                  value={orderDetails.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Ej. Calle 123 # 45-67"
                  className={`w-full bg-[#161616] border ${
                    formErrors.address ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FF5A20]'
                  } rounded-xl py-2.5 px-3 text-xs text-white outline-none transition-all placeholder:text-white/20`}
                />
                {formErrors.address && (
                  <span className="text-[9px] text-red-400 font-bold block">{formErrors.address}</span>
                )}
              </div>

              {/* Barrio */}
              <div className="space-y-1" data-error={!!formErrors.neighborhood}>
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider flex items-center gap-1">
                  <Building size={11} className="text-white/40" />
                  Barrio *
                </label>
                <input
                  type="text"
                  value={orderDetails.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Ej. Belén / Laureles"
                  className={`w-full bg-[#161616] border ${
                    formErrors.neighborhood ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FF5A20]'
                  } rounded-xl py-2 px-3 text-xs text-white outline-none transition-all placeholder:text-white/20`}
                />
                {formErrors.neighborhood && (
                  <span className="text-[9px] text-red-400 font-bold block">{formErrors.neighborhood}</span>
                )}
              </div>

              {/* Optional: Apartment, Tower, Floor */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-white/40 tracking-wider">Apto / Casa</label>
                  <input
                    type="text"
                    value={orderDetails.apartment || ''}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    placeholder="Ej. 402"
                    className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-1.5 px-2.5 text-xs text-white outline-none transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-white/40 tracking-wider">Torre</label>
                  <input
                    type="text"
                    value={orderDetails.tower || ''}
                    onChange={(e) => handleInputChange('tower', e.target.value)}
                    placeholder="Ej. A"
                    className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-1.5 px-2.5 text-xs text-white outline-none transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-white/40 tracking-wider">Piso</label>
                  <input
                    type="text"
                    value={orderDetails.floor || ''}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    placeholder="Ej. 4"
                    className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-1.5 px-2.5 text-xs text-white outline-none transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              {/* General Observations */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider flex items-center gap-1">
                  <Clipboard size={11} className="text-white/40" />
                  Indicaciones Adicionales (Opcional)
                </label>
                <textarea
                  value={orderDetails.observations || ''}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Ej. Tocar el timbre, reja negra de dos pisos..."
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl p-3 text-xs text-white placeholder:text-white/20 outline-none transition-all h-16 resize-none font-sans"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Pricing Totals Card & Checkout Button */}
          <div className="mt-auto p-5 bg-[#161616] border-t border-white/10 space-y-4 sticky bottom-0 z-15 shadow-2xl">
            {/* Breakdowns */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-white/60">
                <span>Subtotal:</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Domicilio:</span>
                <span className="font-mono">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="h-[1px] bg-white/5 my-1"></div>
              <div className="flex justify-between text-sm font-black text-[#FF5A20]">
                <span className="uppercase tracking-wider">Total de la Orden:</span>
                <span className="font-mono text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Error banner indicator */}
            {Object.keys(formErrors).length > 0 && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/10 border border-red-900/20 p-2.5 rounded-xl text-[11px] font-medium leading-none">
                <AlertCircle size={14} className="shrink-0 animate-pulse" />
                <span>Completa los campos obligatorios (*) marcados en rojo.</span>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#FF5A20] to-amber-600 hover:from-amber-600 hover:to-[#FF5A20] disabled:from-white/5 disabled:to-white/5 disabled:text-white/20 text-[#0D0D0D] py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg shadow-[#FF5A20]/15 hover:shadow-[#FF5A20]/25 active:scale-98 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4.5 h-4.5 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin"></div>
                  Procesando Pedido...
                </>
              ) : (
                <>
                  <MessageSquare size={16} />
                  Enviar Pedido por WhatsApp
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

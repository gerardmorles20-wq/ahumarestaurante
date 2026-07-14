/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Phone, Instagram, Clock, Compass, BookOpen, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const InfoView: React.FC = () => {
  const { restaurantInfo } = useStore();

  const defaultGalleryImages = [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400', // Smoked meat
    'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=400', // Steak grill fire
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', // Smoke delphia burger
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400', // French fries loaded
    'https://images.unsplash.com/photo-1627843563095-f6e94e70ecfc?auto=format&fit=crop&q=80&w=400', // Tomahawk steak
    'https://images.unsplash.com/photo-1608270176050-12ecd0f5243a?auto=format&fit=crop&q=80&w=400', // Craft beer glass
  ];

  const galleryImages = restaurantInfo.infoGalleryImages && restaurantInfo.infoGalleryImages.length > 0
    ? restaurantInfo.infoGalleryImages
    : defaultGalleryImages;

  return (
    <div className="flex-1 overflow-y-auto bg-[#0D0D0D] flex flex-col text-left pb-8">
      {/* Brand Header */}
      <div className="relative w-full aspect-[21/9] bg-[#161616] overflow-hidden shrink-0 shadow-md">
        <img
          src={restaurantInfo.infoHeroUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"}
          alt="Ahuma Steakhouse Kitchen"
          className="w-full h-full object-cover brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent"></div>
        <div className="absolute bottom-4 left-5">
          <span className="text-[10px] text-[#FF5A20] font-bold tracking-widest uppercase">
            {restaurantInfo.infoSubtitle || 'NUESTRA ESENCIA'}
          </span>
          <h2 className="text-xl font-black text-white uppercase tracking-wide">{restaurantInfo.name}</h2>
        </div>
      </div>

      {/* Story / Historia Section */}
      <div className="px-5 py-6 space-y-3 shrink-0">
        <h3 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
          <BookOpen size={14} className="text-[#FF5A20]" />
          Nuestra Historia
        </h3>
        <p className="text-xs text-white/80 leading-relaxed font-serif italic text-justify bg-[#161616]/40 p-4 rounded-2xl border border-white/5 shadow-inner">
          "{restaurantInfo.history}"
        </p>
      </div>

      {/* Embedded Interactive Map */}
      <div className="px-5 py-4 space-y-3 shrink-0">
        <h3 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
          <MapPin size={14} className="text-[#FF5A20]" />
          Encuéntranos en Belén
        </h3>

        <div className="w-full aspect-[16/10] bg-[#161616] rounded-2xl border border-white/5 overflow-hidden shadow-inner relative">
          {/* Iframe standard Google Maps Embed */}
          <iframe
            src={restaurantInfo.mapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer"
            title="Ahuma Restaurante Location Map"
            className="w-full h-full brightness-[0.85] contrast-[1.05]"
          ></iframe>
        </div>

        <div className="grid grid-cols-1 gap-2.5 pt-1.5">
          <div className="flex items-start gap-3 p-3 bg-[#161616]/60 border border-white/5 rounded-2xl">
            <MapPin size={15} className="text-[#FF5A20] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-white">Dirección Física</p>
              <p className="text-white/60 font-mono mt-0.5">{restaurantInfo.address}, Belén, Medellín</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#161616]/60 border border-white/5 rounded-2xl">
            <Clock size={15} className="text-[#FF5A20] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-white">Horarios de Atención</p>
              <p className="text-white/60 font-mono mt-0.5">{restaurantInfo.schedule}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Social Links */}
      <div className="px-5 py-4 space-y-3 shrink-0">
        <h3 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Compass size={14} className="text-[#FF5A20]" />
          Contacto y Redes
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={`https://instagram.com/ahumarestaurante`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-3.5 bg-[#161616] border border-white/5 hover:border-[#FF5A20]/20 rounded-2xl group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-white/10 flex items-center justify-center text-white/60 group-hover:text-[#FF5A20] transition-colors">
              <Instagram size={15} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-white/40">Instagram</p>
              <p className="text-xs font-bold text-white/85">@ahumarestaurante</p>
            </div>
          </a>

          <a
            href={`tel:${restaurantInfo.phone}`}
            className="flex items-center gap-3 p-3.5 bg-[#161616] border border-white/5 hover:border-[#FF5A20]/20 rounded-2xl group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-white/10 flex items-center justify-center text-white/60 group-hover:text-[#FF5A20] transition-colors">
              <Phone size={15} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-white/40">Llamar</p>
              <p className="text-xs font-bold text-white/85">+{restaurantInfo.phone}</p>
            </div>
          </a>
        </div>
      </div>

      {/* Food Gallery Section */}
      <div className="px-5 py-4 space-y-3 shrink-0">
        <h3 className="text-xs font-black uppercase text-white/40 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
          <ImageIcon size={14} className="text-[#FF5A20]" />
          Galería de Fotos
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="aspect-square bg-[#161616] rounded-xl overflow-hidden border border-white/5 hover:border-[#FF5A20]/20 transition-all shadow-md group cursor-zoom-in"
            >
              <img
                src={img}
                alt={`Ahuma Gallery ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

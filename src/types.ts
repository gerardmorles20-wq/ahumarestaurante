/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  order?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Category ID
  imageUrl: string;
  tags?: string[]; // e.g. ["Nuevo", "Picante", "Recomendado", "Promoción"]
  isNew?: boolean;
  isSpicy?: boolean;
  isRecommended?: boolean;
  isPromo?: boolean;
  promoPrice?: number;
  isOutOfStock?: boolean;
  ingredients?: string[];
  accompanimentsCount?: number; // Number of selectables (like 2 for parrillero cuts)
  order?: number;
}

export interface CartItem {
  id: string; // Unique ID for cart item (productId + options hash)
  product: Product;
  quantity: number;
  notes?: string;
  selectedAccompaniments?: string[];
}

export interface RestaurantInfo {
  name: string;
  logoUrl?: string;
  bannerUrl: string;
  description: string;
  history: string;
  address: string;
  neighborhood: string;
  phone: string;
  whatsapp: string;
  deliveryCost: number;
  rating: number;
  schedule: string;
  instagramUrl: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  showHomeTrashButton?: boolean;
  homeTrashButtonText?: string;
  homeTrashButtonAction?: 'clear_cart' | 'clear_all';
  infoHeroUrl?: string;
  infoSubtitle?: string;
  infoGalleryImages?: string[];
}

export interface OrderDetails {
  name: string;
  surname: string;
  phone: string;
  address: string;
  neighborhood: string;
  apartment?: string;
  tower?: string;
  floor?: string;
  observations?: string;
}

export interface AppState {
  categories: Category[];
  products: Product[];
  restaurantInfo: RestaurantInfo;
  cart: CartItem[];
  orderDetails: OrderDetails;
}

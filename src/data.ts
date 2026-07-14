/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Product, RestaurantInfo } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'entradas', name: 'Entradas', icon: 'Flame' },
  { id: 'parrillero', name: 'Parrillero (Cortes)', icon: 'Beef' },
  { id: 'burgers', name: 'Hamburguesas', icon: 'Utensils' },
  { id: 'adiciones', name: 'Adiciones', icon: 'PlusCircle' },
  { id: 'cervezas', name: 'Cervezas', icon: 'Wine' },
  { id: 'gaseosas', name: 'Gaseosas', icon: 'GlassWater' },
  { id: 'jugos_naturales', name: 'Jugos Naturales', icon: 'Citrus' },
];

export const DEFAULT_ACCOMPANIMENTS = [
  'Papas a la francesa',
  'Papas rústicas',
  'Ensalada romana',
  'Arepitas',
  'Mazorquitas'
];

export const DEFAULT_RESTAURANT_INFO: RestaurantInfo = {
  name: 'Ahúma',
  description: 'Cortes premium madurados, cocidos lentamente al calor del fuego y el abrazo del humo, logrando carnes increíblemente suaves, jugosas y llenas de carácter.',
  history: 'En Ahúma sabemos que el verdadero sabor necesita tiempo. Cada corte pasa horas al calor del fuego y el abrazo del humo, absorbiendo lentamente los aromas que lo hacen único. Así logramos carnes suaves, jugosas y llenas de carácter, preparadas con dedicación y respeto por lo que más nos gusta: compartir el placer de una buena mesa.',
  address: 'Cra 83 # 17 - 10',
  neighborhood: 'Belén',
  phone: '3042300570',
  whatsapp: '3042300570',
  deliveryCost: 8000,
  rating: 4.8,
  schedule: 'Martes a Domingo: 12:00 PM - 10:00 PM (Lunes cerrado)',
  instagramUrl: 'https://instagram.com/ahumarestaurante',
  mapsUrl: 'https://maps.app.goo.gl/hEyuhso8hKoCkGVL7',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.368305886561!2d-75.6111812!3d6.2150537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e44299b6bb2a313%3A0xe5a363717e1cb465!2sCra.%2083%20%2317-10%2C%20Bel%C3%A9n%2C%20Medell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco',
  bannerUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200',
  showHomeTrashButton: false,
  homeTrashButtonText: 'Vaciar',
  homeTrashButtonAction: 'clear_cart',
  infoHeroUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
  infoSubtitle: 'NUESTRA ESENCIA',
  infoGalleryImages: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1627843563095-f6e94e70ecfc?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1608270176050-12ecd0f5243a?auto=format&fit=crop&q=80&w=400'
  ],
};

export const DEFAULT_PRODUCTS: Product[] = [
  // --- ENTRADAS ---
  {
    id: 'entradas-ahuma-pork',
    name: 'Ahúma Pork',
    description: 'BASE DE PAPAS DORADAS, CORONADAS CON PULLED PORK AHUMADO A FUEGO LENTO, ACOMPAÑADA DE QUESO PHILADELPHIA.',
    price: 17900,
    category: 'entradas',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    tags: ['Recomendado'],
    isRecommended: true,
    ingredients: ['Papas doradas', 'Pulled pork ahumado', 'Queso Philadelphia']
  },
  {
    id: 'entradas-cheesy-bacon',
    name: 'Cheesy Bacon',
    description: 'CRUJIENTES POR FUERA, SUAVES POR DENTRO, CUBIERTAS CON TOCINETA CROCANTE Y BAÑADAS EN UNA SALSA DE QUESO CHEDDAR INTENSA Y CREMOSA.',
    price: 17900,
    category: 'entradas',
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=600',
    tags: ['Favorito'],
    ingredients: ['Papas', 'Tocineta crocante', 'Salsa de queso cheddar']
  },
  {
    id: 'entradas-queso-asado',
    name: 'Queso asado',
    description: 'SELLADO AL FUEGO ACOMPAÑADO DE MERMELADA, EL TOQUE DULCE QUE REALZA SU SABOR.',
    price: 17900,
    category: 'entradas',
    imageUrl: 'https://images.unsplash.com/photo-1559561853-08026ff1047d?auto=format&fit=crop&q=80&w=600',
    tags: ['Recomendado'],
    isRecommended: true,
    ingredients: ['Queso sellado al fuego', 'Mermelada']
  },

  // --- PARRILLERO (CORTES) ---
  {
    id: 'parrillero-parrillada-compartir-2p',
    name: 'Parrillada para Compartir (2 Personas - 500g)',
    description: 'INCLUYE NUESTROS 4 CORTES ESTRELLA: PECHUGA, TOCINO AHUMADO, PUNTA DE ANCA & COSTILLA ST. LOUIS. ACOMPAÑADA DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 69900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    tags: ['Producto Estrella'],
    isRecommended: true,
    accompanimentsCount: 2,
    ingredients: ['Pechuga', 'Tocino ahumado', 'Punta de anca', 'Costilla St. Louis', '2 Acompañantes']
  },
  {
    id: 'parrillero-parrillada-compartir-4p',
    name: 'Parrillada para Compartir (3-4 Personas - 1000g)',
    description: 'INCLUYE NUESTROS 4 CORTES ESTRELLA: PECHUGA, TOCINO AHUMADO, PUNTA DE ANCA & COSTILLA ST. LOUIS. ACOMPAÑADA DE 4 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 129900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=600',
    tags: ['Recomendado'],
    accompanimentsCount: 4,
    ingredients: ['Pechuga', 'Tocino ahumado', 'Punta de anca', 'Costilla St. Louis', '4 Acompañantes']
  },
  {
    id: 'parrillero-parrillada-personal',
    name: 'Parrillada Personal (300g)',
    description: 'INCLUYE NUESTROS CORTES ESTRELLA: PECHUGA, TOCINO AHUMADO & COSTILLA. ACOMPAÑADA DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 45900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=600',
    tags: ['Individual'],
    accompanimentsCount: 2,
    ingredients: ['Pechuga', 'Tocino ahumado', 'Costilla', '2 Acompañantes']
  },
  {
    id: 'parrillero-punta-de-anca-200g',
    name: 'Punta de Anca (200g)',
    description: 'CORTE PREMIUM AHUMADO LENTAMENTE PARA ALCANZAR UNA TEXTURA PERFECTA, LUEGO SELLADO CON MANTEQUILLA DE AJO Y ROMERO QUE LE DA ESE TOQUE AROMÁTICO IRRESISTIBLE. ACOMPAÑADO DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 46900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    tags: ['Producto Estrella'],
    isRecommended: true,
    accompanimentsCount: 2,
    ingredients: ['Punta de anca 200g', 'Mantequilla de ajo', 'Romero', '2 Acompañantes']
  },
  {
    id: 'parrillero-punta-de-anca-300g',
    name: 'Punta de Anca (300g)',
    description: 'CORTE PREMIUM AHUMADO LENTAMENTE PARA ALCANZAR UNA TEXTURA PERFECTA, LUEGO SELLADO CON MANTEQUILLA DE AJO Y ROMERO QUE LE DA ESE TOQUE AROMÁTICO IRRESISTIBLE. ACOMPAÑADO DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 59900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    tags: ['Premium'],
    accompanimentsCount: 2,
    ingredients: ['Punta de anca 300g', 'Mantequilla de ajo', 'Romero', '2 Acompañantes']
  },
  {
    id: 'parrillero-tocino-ahumado',
    name: 'Tocino Ahumado (250g)',
    description: '250G DE TOCINO AHUMADO DURANTE HORAS, CRUJIENTE POR FUERA Y SUAVE POR DENTRO GRACIAS A SU SELLADO EN MANTEQUILLA DE AJO Y ROMERO. ACOMPAÑADO DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 36900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1606850780554-b55ea4de0b70?auto=format&fit=crop&q=80&w=600',
    tags: ['Producto Estrella'],
    isRecommended: true,
    accompanimentsCount: 2,
    ingredients: ['Tocino ahumado 250g', 'Mantequilla de ajo', 'Romero', '2 Acompañantes']
  },
  {
    id: 'parrillero-solomito-200g',
    name: 'Solomito (200g)',
    description: 'UN CORTE NOBLE, TRABAJADO CON PRECISIÓN. TIERNO, JUGOSO Y PERFECTAMENTE SELLADO. ACOMPAÑADO DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 46900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    tags: ['Recomendado'],
    accompanimentsCount: 2,
    ingredients: ['Solomito 200g', 'Perfectamente sellado', '2 Acompañantes']
  },
  {
    id: 'parrillero-solomito-300g',
    name: 'Solomito (300g)',
    description: 'UN CORTE NOBLE, TRABAJADO CON PRECISIÓN. TIERNO, JUGOSO Y PERFECTAMENTE SELLADO. ACOMPAÑADO DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 59900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    tags: ['Premium'],
    accompanimentsCount: 2,
    ingredients: ['Solomito 300g', 'Perfectamente sellado', '2 Acompañantes']
  },
  {
    id: 'parrillero-pechuga-ahumada',
    name: 'Pechuga Ahumada (250g)',
    description: '250G DE PECHUGA DE POLLO COCINADA A FUEGO LENTO HASTA QUEDAR TIERNA Y JUGOSA, SELLADA EN PARRILLA CON MANTEQUILLA DE AJO Y ROMERO QUE DESPIERTAN TODOS SUS AROMAS. ACOMPAÑADA DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 35900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600',
    accompanimentsCount: 2,
    ingredients: ['Pechuga de pollo 250g', 'Mantequilla de ajo', 'Romero', '2 Acompañantes']
  },
  {
    id: 'parrillero-costillas-st-louis-300g',
    name: 'St. Louis Costillas (300g)',
    description: 'COSTILLA DE CERDO COCIDA POR 6 HORAS AL HUMO LENTO, TIERNA AL PUNTO DE DESHACERSE, BAÑADA EN NUESTRA SALSA BBQ DE LA CASA QUE LA LLEVA A OTRO NIVEL. ACOMPAÑADA DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 39900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    tags: ['Lento Ahumado'],
    accompanimentsCount: 2,
    ingredients: ['Costilla de cerdo 300g', 'BBQ de la casa', '2 Acompañantes']
  },
  {
    id: 'parrillero-costillas-st-louis-500g',
    name: 'St. Louis Costillas (500g)',
    description: 'COSTILLA DE CERDO COCIDA POR 6 HORAS AL HUMO LENTO, TIERNA AL PUNTO DE DESHACERSE, BAÑADA EN NUESTRA SALSA BBQ DE LA CASA QUE LA LLEVA A OTRO NIVEL. ACOMPAÑADA DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 59900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    tags: ['Popular'],
    accompanimentsCount: 2,
    ingredients: ['Costilla de cerdo 500g', 'BBQ de la casa', '2 Acompañantes']
  },
  {
    id: 'parrillero-tomahawk',
    name: 'Tomahawk (600g - 700g)',
    description: 'UN CORTE ICÓNICO, CON HUESO EXPUESTO Y MARMOLEO SUPERIOR. MADURADO Y LLEVADO A FUEGO DIRECTO PARA DESARROLLAR UNA COSTRA PROFUNDA, MIENTRAS SU INTERIOR SE MANTIENE JUGOSO Y LLENO DE MATICES. ACOMPAÑADO DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 129900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1627843563095-f6e94e70ecfc?auto=format&fit=crop&q=80&w=600',
    tags: ['Premium'],
    isRecommended: true,
    accompanimentsCount: 2,
    ingredients: ['Tomahawk 600-700g', 'Hueso expuesto', '2 Acompañantes']
  },
  {
    id: 'parrillero-ribeye',
    name: 'Ribeye (400g)',
    description: 'RECONOCIDO POR SU MARMOLEO EXCEPCIONAL, ESTE CORTE OFRECE UNA JUGOSIDAD ENVOLVENTE Y UN SABOR PROFUNDO. SELLADO A ALTA TEMPERATURA PARA POTENCIAR SU CARÁCTER Y TERMINADO EN SU PUNTO EXACTO. ACOMPAÑADO DE 2 ACOMPAÑANTES DE TU ELECCIÓN.',
    price: 79900,
    category: 'parrillero',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    tags: ['Premium'],
    accompanimentsCount: 2,
    ingredients: ['Ribeye 400g', 'Marmoleo excepcional', '2 Acompañantes']
  },

  // --- BURGERS ---
  {
    id: 'burgers-smoke-delphia',
    name: 'Smoke Delphia',
    description: 'UNA EXPLOSIÓN CREMOSA Y AHUMADA. PAN ARTESANAL, CARNE ARTESANAL AHUMADA DE 180 G, QUESO PHILADELPHIA Y CHEDDAR DERRITIÉNDOSE EN CADA BOCADO, TOCINETA CROCANTE, CEBOLLA CARAMELIZADA O FRESCA, LECHUGA FRESCA, TOMATE Y NUESTRA SALSA BBQ. ACOMPAÑADA DE PAPAS FRITAS.',
    price: 35900,
    category: 'burgers',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    tags: ['Producto Estrella'],
    isRecommended: true,
    ingredients: ['Carne ahumada 180g', 'Queso Philadelphia', 'Queso Cheddar', 'Tocineta crocante', 'BBQ', 'Papas fritas']
  },
  {
    id: 'burgers-ahuma-classic',
    name: 'Ahúma Classic',
    description: 'LA CLÁSICA QUE NUNCA FALLA. PAN ARTESANAL DORADO, JUGOSA CARNE ARTESANAL DE 180 G, QUESO CHEDDAR FUNDIDO, CEBOLLA CARAMELIZADA O FRESCA, TÚ DECIDES, LECHUGA CRUJIENTE, TOMATE JUGOSO. ACOMPAÑADA DE PAPAS FRITAS.',
    price: 26900,
    category: 'burgers',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600',
    tags: ['Clásico'],
    ingredients: ['Carne artesanal 180g', 'Queso cheddar', 'Cebolla caramelizada/fresca', 'Papas fritas']
  },
  {
    id: 'burgers-smoke-pork',
    name: 'Smoke Pork',
    description: '180 G DE CARNE ARTESANAL MÁS CARNE DESMECHADA COCIDA A FUEGO LENTO, JUGOSA Y CARGADA DE SABOR, BAÑADA EN NUESTRA BBQ ARTESANAL. PAN DORADO, QUESO FUNDIDO, TOQUES FRESCOS QUE EQUILIBRAN Y UNA TEXTURA QUE SE DESHACE EN CADA BOCADO. ACOMPAÑADA DE PAPAS FRITAS.',
    price: 32900,
    category: 'burgers',
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=600',
    tags: ['Recomendado'],
    ingredients: ['Carne artesanal 180g', 'Carne desmechada al fuego lento', 'Queso fundido', 'Salsa BBQ', 'Papas fritas']
  },
  {
    id: 'burgers-smoke-bacon',
    name: 'Smoke Bacon',
    description: 'PARA LOS QUE QUIEREN TODO. PAN ARTESANAL, CARNE ARTESANAL AHUMADA DE 180 G, DOBLE CHEDDAR, DOBLE TOCINETA AHUMADA BAÑADA EN BBQ, PEPINILLOS CROCANTES, CEBOLLA CARAMELIZADA Y UN DIP SECRETO QUE REDONDEA ESTA BOMBA DE SABOR. ACOMPAÑADA DE PAPAS FRITAS.',
    price: 37900,
    category: 'burgers',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=600',
    tags: ['Bomba de Sabor'],
    ingredients: ['Carne ahumada 180g', 'Doble cheddar', 'Doble tocineta ahumada', 'Pepinillos', 'Dip secreto', 'Papas fritas']
  },
  {
    id: 'burgers-pina-humo',
    name: 'Piña & Humo',
    description: 'EL FUEGO SE ENCUENTRA CON LO FRESCO. CARNE AHUMADA JUGOSA DE 180 G, QUESO FUNDIDO, TOCINETA, QUESO PHILADELPHIA Y EL CONTRASTE PERFECTO DE LO TROPICAL QUE LE DA UN GIRO INESPERADO: DULCE Y AHUMADO. ACOMPAÑADA DE PAPAS FRITAS.',
    price: 38900,
    category: 'burgers',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=600',
    tags: ['Tropical & Fusión'],
    ingredients: ['Carne ahumada 180g', 'Piña caramelizada', 'Tocineta', 'Queso Philadelphia', 'Queso fundido', 'Papas fritas']
  },

  // --- ADICIONES (Page 4 Combinaciones & Page 8 Adiciones) ---
  { id: 'adiciones-papas-francesa', name: 'Papas Francesa', description: 'Porción individual de papas fritas crujientes.', price: 5900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-papas-rusticas', name: 'Papas Rústicas', description: 'Porción individual de papas rústicas con finas hierbas.', price: 5900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-ensalada-romana', name: 'Ensalada Romana', description: 'Porción individual de lechuga fresca con parmesano y aderezo especial.', price: 5900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-arepitas-asadas', name: 'Arepitas Asadas', description: 'Porción individual de arepitas de maíz asadas.', price: 5900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-mazorcas-asadas', name: 'Mazorcas Asadas', description: 'Porción individual de mazorca dulce asada al fuego con mantequilla.', price: 5900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&q=80&w=600' },
  
  { id: 'adiciones-queso-cheddar', name: 'Queso Cheddar', description: 'Adición de queso cheddar derretido para complementar tu corte.', price: 2900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1552763405-17497baad774?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-queso-philadelphia', name: 'Queso Philadelphia', description: 'Adición de queso crema Philadelphia extra cremoso.', price: 4900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1559561853-08026ff1047d?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-queso-asado', name: 'Queso Asado', description: 'Porción extra de queso asado sellado al fuego.', price: 17900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1559561853-08026ff1047d?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-pepinillos', name: 'Pepinillos', description: 'Porción extra de rodajas de pepinillos crocantes agridulces.', price: 3900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-tocineta', name: 'Tocineta', description: 'Porción extra de tiras de tocineta crujiente.', price: 4900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1606850780554-b55ea4de0b70?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-carne-hamburguesa', name: 'Carne de Hamburguesa', description: 'Carne artesanal extra de 180g.', price: 13900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600' },
  
  // Cortes / Adiciones Combinación Perfecta (Page 4)
  { id: 'adiciones-tocino-100g', name: 'Tocino 100g', description: 'Adición de tocino premium de 100g para tu plato o corte.', price: 13900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1606850780554-b55ea4de0b70?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-pechuga-100g', name: 'Pechuga 100g', description: 'Adición de tierna pechuga de pollo de 100g.', price: 13900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-costilla-unidad', name: 'Costilla *Unidad*', description: 'Una unidad adicional de costilla ahumada.', price: 13900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600' },
  { id: 'adiciones-punta-de-anca-100g', name: 'Punta de Anca 100g', description: 'Adición de jugosa punta de anca de 100g.', price: 13900, category: 'adiciones', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600' },

  // --- JUGOS NATURALES (Page 11) ---
  { id: 'bebidas-jugo-agua', name: 'Jugo en Agua', description: 'Jugo natural de fruta fresca preparado en agua (Fresa, Mango, Lulo, Maracuyá).', price: 8900, category: 'jugos_naturales', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-jugo-leche', name: 'Jugo en Leche', description: 'Jugo natural de fruta fresca preparado en leche cremosa.', price: 11900, category: 'jugos_naturales', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-limonada-natural', name: 'Limonada Natural', description: 'Refrescante jugo de limón natural con hielo.', price: 6900, category: 'jugos_naturales', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-limonada-saborizada', name: 'Limonada Saborizada', description: 'Variedad de limonadas especiales (Coco, Cereza o Cerezada).', price: 8900, category: 'jugos_naturales', imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600' },

  // --- CERVEZAS (Page 11) ---
  { id: 'bebidas-vaso-michelado', name: 'Vaso Michelado', description: 'Vaso escarchado con sal, limón y pimienta listo para tu cerveza.', price: 1900, category: 'cervezas', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-cerveza-aguila', name: 'Cerveza Águila', description: 'Cerveza tradicional Águila helada en botella.', price: 7900, category: 'cervezas', imageUrl: 'https://images.unsplash.com/photo-1608270176050-12ecd0f5243a?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-cerveza-aguila-light', name: 'Cerveza Águila Light', description: 'Cerveza ligera Águila Light helada.', price: 7900, category: 'cervezas', imageUrl: 'https://images.unsplash.com/photo-1608270176050-12ecd0f5243a?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-cerveza-pilsen', name: 'Cerveza Pilsen', description: 'Cerveza regional Pilsen bien fría.', price: 7900, category: 'cervezas', imageUrl: 'https://images.unsplash.com/photo-1608270176050-12ecd0f5243a?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-cerveza-club-colombia', name: 'Cerveza Club Colombia', description: 'Cerveza Club Colombia Premium.', price: 8900, category: 'cervezas', imageUrl: 'https://images.unsplash.com/photo-1608270176050-12ecd0f5243a?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-cerveza-heineken', name: 'Cerveza Heineken', description: 'Cerveza importada Heineken helada.', price: 9900, category: 'cervezas', imageUrl: 'https://images.unsplash.com/photo-1608270176050-12ecd0f5243a?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-cerveza-corona', name: 'Cerveza Corona', description: 'Cerveza Corona Extra helada de 355ml.', price: 11900, category: 'cervezas', imageUrl: 'https://images.unsplash.com/photo-1608270176050-12ecd0f5243a?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-cerveza-3cordilleras', name: 'Cerveza 3 Cordilleras', description: 'Cerveza artesanal local 3 Cordilleras (Mestiza, Mulata o Blanca).', price: 12900, category: 'cervezas', imageUrl: 'https://images.unsplash.com/photo-1608270176050-12ecd0f5243a?auto=format&fit=crop&q=80&w=600' },

  // --- GASEOSAS (Page 11) ---
  { id: 'bebidas-soda-saborizada', name: 'Soda Saborizada', description: 'Soda con infusión artesanal premium saborizada.', price: 13900, category: 'gaseosas', imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-coca-cola', name: 'Coca Cola Original o Zero', description: 'Gaseosa Coca-Cola helada (opción clásica o sin azúcar).', price: 6400, category: 'gaseosas', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-gaseosas', name: 'Gaseosas', description: 'Otras variedades de gaseosas de la casa.', price: 6400, category: 'gaseosas', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-soda', name: 'Soda', description: 'Soda refrescante simple en botella o lata.', price: 6400, category: 'gaseosas', imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-hatsu-soda', name: 'Hatsu Soda', description: 'Soda premium Hatsu de sabores seleccionados.', price: 7900, category: 'gaseosas', imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-hatsu-te', name: 'Hatsu Té', description: 'Té helado premium Hatsu en botella de vidrio.', price: 11900, category: 'gaseosas', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600' },
  { id: 'bebidas-agua', name: 'Agua', description: 'Agua fresca mineral sin gas en botella.', price: 3900, category: 'gaseosas', imageUrl: 'https://images.unsplash.com/photo-1608885898957-a599fb15e841?auto=format&fit=crop&q=80&w=600' },
];

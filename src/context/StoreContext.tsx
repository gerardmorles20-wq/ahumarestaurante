/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Product, CartItem, RestaurantInfo, OrderDetails } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_RESTAURANT_INFO } from '../data';
import { db } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

interface StoreContextType {
  categories: Category[];
  products: Product[];
  restaurantInfo: RestaurantInfo;
  cart: CartItem[];
  orderDetails: OrderDetails;
  
  // Cart Actions
  addToCart: (product: Product, quantity: number, notes?: string, accompaniments?: string[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Order details actions
  updateOrderDetails: (details: Partial<OrderDetails>) => void;
  
  // Admin Actions (Products)
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Admin Actions (Categories)
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  
  // Admin Actions (Restaurant details)
  updateRestaurantInfo: (info: Partial<RestaurantInfo>) => void;
  
  // Helper to reset to defaults
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('ahuma_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ahuma_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(() => {
    const saved = localStorage.getItem('ahuma_info');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as RestaurantInfo;
        // Auto-migrate old default mapsUrl to the corrected one
        if (parsed.mapsUrl === 'https://maps.app.goo.gl/SvxlsgwfaZV7wkPa1' || !parsed.mapsUrl) {
          parsed.mapsUrl = 'https://maps.app.goo.gl/hEyuhso8hKoCkGVL7';
          localStorage.setItem('ahuma_info', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing stored restaurant info:', e);
      }
    }
    return DEFAULT_RESTAURANT_INFO;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ahuma_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderDetails, setOrderDetails] = useState<OrderDetails>(() => {
    const saved = localStorage.getItem('ahuma_order_details');
    return saved ? JSON.parse(saved) : {
      name: '',
      surname: '',
      phone: '',
      address: '',
      neighborhood: '',
      apartment: '',
      tower: '',
      floor: '',
      observations: '',
    };
  });

  // Sync to localStorage safely for client-only states
  useEffect(() => {
    try {
      const currentSaved = localStorage.getItem('ahuma_cart');
      const newStr = JSON.stringify(cart);
      if (currentSaved !== newStr) {
        localStorage.setItem('ahuma_cart', newStr);
      }
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      const currentSaved = localStorage.getItem('ahuma_order_details');
      const newStr = JSON.stringify(orderDetails);
      if (currentSaved !== newStr) {
        localStorage.setItem('ahuma_order_details', newStr);
      }
    } catch (e) {
      console.error('Error saving order details to localStorage:', e);
    }
  }, [orderDetails]);

  useEffect(() => {
    try {
      const currentSaved = localStorage.getItem('ahuma_categories');
      const newStr = JSON.stringify(categories);
      if (currentSaved !== newStr) {
        localStorage.setItem('ahuma_categories', newStr);
      }
    } catch (e) {
      console.error('Error saving categories to localStorage:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      const currentSaved = localStorage.getItem('ahuma_products');
      const newStr = JSON.stringify(products);
      if (currentSaved !== newStr) {
        localStorage.setItem('ahuma_products', newStr);
      }
    } catch (e) {
      console.error('Error saving products to localStorage:', e);
    }
  }, [products]);

  // Real-time synchronization across different windows/tabs of the same user for Cart/Order using Storage Events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      
      try {
        if (e.key === 'ahuma_cart') {
          const parsed = JSON.parse(e.newValue);
          setCart(parsed);
        } else if (e.key === 'ahuma_order_details') {
          const parsed = JSON.parse(e.newValue);
          setOrderDetails(parsed);
        }
      } catch (err) {
        console.error('Error syncing local state from storage event:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Real-time synchronization with Firestore for shared state (categories, products, restaurantInfo)
  useEffect(() => {
    // 1. Listen to Restaurant Info
    const infoDocRef = doc(db, 'restaurant_info', 'config');
    const unsubInfo = onSnapshot(infoDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as RestaurantInfo;
        // Auto-migrate old default mapsUrl or empty mapsUrl to the corrected one
        if (data.mapsUrl === 'https://maps.app.goo.gl/SvxlsgwfaZV7wkPa1' || !data.mapsUrl) {
          try {
            await setDoc(infoDocRef, { mapsUrl: 'https://maps.app.goo.gl/hEyuhso8hKoCkGVL7' }, { merge: true });
          } catch (e) {
            console.error('Error auto-migrating mapsUrl in Firestore:', e);
          }
        }
        setRestaurantInfo({ ...DEFAULT_RESTAURANT_INFO, ...data });
      } else {
        try {
          await setDoc(infoDocRef, DEFAULT_RESTAURANT_INFO);
        } catch (e) {
          console.error('Error bootstrapping restaurant_info:', e);
        }
      }
    }, (error) => {
      console.error('Error listening to restaurant info:', error);
    });

    // 2. Listen to Categories
    const categoriesColRef = collection(db, 'categories');
    const unsubCategories = onSnapshot(categoriesColRef, async (snapshot) => {
      if (!snapshot.empty) {
        const cats: Category[] = [];
        snapshot.forEach((doc) => {
          cats.push(doc.data() as Category);
        });
        // Sort categories by order if defined, otherwise preserve original DEFAULT_CATEGORIES indices
        cats.sort((a, b) => {
          const orderA = a.order !== undefined ? a.order : DEFAULT_CATEGORIES.findIndex(c => c.id === a.id);
          const orderB = b.order !== undefined ? b.order : DEFAULT_CATEGORIES.findIndex(c => c.id === b.id);
          const valA = orderA !== -1 ? orderA : 999;
          const valB = orderB !== -1 ? orderB : 999;
          return valA - valB;
        });
        setCategories(cats);
      } else {
        try {
          const bootstrapSnap = await getDoc(doc(db, 'system', 'bootstrap'));
          if (!bootstrapSnap.exists() || !bootstrapSnap.data()?.seeded) {
            let idx = 0;
            for (const cat of DEFAULT_CATEGORIES) {
              await setDoc(doc(db, 'categories', cat.id), { ...cat, order: idx++ });
            }
            await setDoc(doc(db, 'system', 'bootstrap'), { seeded: true }, { merge: true });
          } else {
            setCategories([]);
          }
        } catch (e) {
          console.error('Error bootstrapping categories:', e);
          setCategories([]);
        }
      }
    }, (error) => {
      console.error('Error listening to categories:', error);
    });

    // 3. Listen to Products
    const productsColRef = collection(db, 'products');
    const unsubProducts = onSnapshot(productsColRef, async (snapshot) => {
      if (!snapshot.empty) {
        const prods: Product[] = [];
        snapshot.forEach((doc) => {
          prods.push(doc.data() as Product);
        });
        // Sort products by order if defined, otherwise preserve original DEFAULT_PRODUCTS indices
        prods.sort((a, b) => {
          const orderA = a.order !== undefined ? a.order : DEFAULT_PRODUCTS.findIndex(p => p.id === a.id);
          const orderB = b.order !== undefined ? b.order : DEFAULT_PRODUCTS.findIndex(p => p.id === b.id);
          const valA = orderA !== -1 ? orderA : 9999;
          const valB = orderB !== -1 ? orderB : 9999;
          return valA - valB;
        });
        setProducts(prods);
      } else {
        try {
          const bootstrapSnap = await getDoc(doc(db, 'system', 'bootstrap'));
          if (!bootstrapSnap.exists() || !bootstrapSnap.data()?.seeded) {
            let idx = 0;
            for (const prod of DEFAULT_PRODUCTS) {
              await setDoc(doc(db, 'products', prod.id), { ...prod, order: idx++ });
            }
            await setDoc(doc(db, 'system', 'bootstrap'), { seeded: true }, { merge: true });
          } else {
            setProducts([]);
          }
        } catch (e) {
          console.error('Error bootstrapping products:', e);
          setProducts([]);
        }
      }
    }, (error) => {
      console.error('Error listening to products:', error);
    });

    return () => {
      unsubInfo();
      unsubCategories();
      unsubProducts();
    };
  }, []);

  // Dynamically sync cart items when products update, ensuring updated prices/stock are reflected in the cart
  useEffect(() => {
    if (products.length === 0) return;
    setCart((prevCart) => {
      let changed = false;
      const updated = prevCart.map((item) => {
        const latestProduct = products.find((p) => p.id === item.product.id);
        if (latestProduct) {
          const hasChanged = 
            item.product.price !== latestProduct.price ||
            item.product.name !== latestProduct.name ||
            item.product.imageUrl !== latestProduct.imageUrl ||
            item.product.isOutOfStock !== latestProduct.isOutOfStock;
          
          if (hasChanged) {
            changed = true;
            return {
              ...item,
              product: latestProduct,
            };
          }
        }
        return item;
      });
      return changed ? updated : prevCart;
    });
  }, [products]);

  // Cart Logic
  const addToCart = (product: Product, quantity: number, notes?: string, accompaniments?: string[]) => {
    setCart((prevCart) => {
      // Create a unique hash or signature for the item depending on choices
      const accompanimentsKey = accompaniments ? [...accompaniments].sort().join(',') : '';
      const notesKey = notes || '';
      const cartItemId = `${product.id}_${accompanimentsKey}_${notesKey}`;

      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            product,
            quantity,
            notes,
            selectedAccompaniments: accompaniments,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateOrderDetails = (details: Partial<OrderDetails>) => {
    setOrderDetails((prev) => ({ ...prev, ...details }));
  };

  // Admin Actions: Products
  const addProduct = async (newProd: Omit<Product, 'id'>) => {
    try {
      const id = `prod_${Date.now()}`;
      const product = { ...newProd, id };
      setProducts((prev) => {
        if (prev.some((p) => p.id === id)) return prev;
        return [...prev, product];
      });
      await setDoc(doc(db, 'products', id), product);
    } catch (e) {
      console.error('Error adding product to Firestore:', e);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
      );
      await setDoc(doc(db, 'products', id), updatedFields, { merge: true });
    } catch (e) {
      console.error('Error updating product in Firestore:', e);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error('Error deleting product from Firestore:', e);
    }
  };

  // Admin Actions: Categories
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    try {
      const id = `cat_${Date.now()}`;
      const category = { ...cat, id };
      setCategories((prev) => {
        if (prev.some((c) => c.id === id)) return prev;
        return [...prev, category];
      });
      await setDoc(doc(db, 'categories', id), category);
    } catch (e) {
      console.error('Error adding category to Firestore:', e);
    }
  };

  const updateCategory = async (id: string, name: string) => {
    try {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name } : c))
      );
      await setDoc(doc(db, 'categories', id), { name }, { merge: true });
    } catch (e) {
      console.error('Error updating category in Firestore:', e);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setProducts((prev) => prev.filter((p) => p.category !== id));
      await deleteDoc(doc(db, 'categories', id));
      // Delete products belonging to this category too
      const productsInCat = products.filter((p) => p.category === id);
      for (const p of productsInCat) {
        await deleteDoc(doc(db, 'products', p.id));
      }
    } catch (e) {
      console.error('Error deleting category from Firestore:', e);
    }
  };

  const updateRestaurantInfo = async (info: Partial<RestaurantInfo>) => {
    try {
      setRestaurantInfo((prev) => ({ ...prev, ...info }));
      await setDoc(doc(db, 'restaurant_info', 'config'), info, { merge: true });
    } catch (e) {
      console.error('Error updating restaurant info in Firestore:', e);
    }
  };

  const resetToDefaults = async () => {
    if (window.confirm('¿Estás seguro de que quieres restablecer todos los datos a sus valores predeterminados de fábrica? Se borrarán tus configuraciones personalizadas.')) {
      try {
        // Delete all current categories and products in Firestore
        for (const cat of categories) {
          await deleteDoc(doc(db, 'categories', cat.id));
        }
        for (const prod of products) {
          await deleteDoc(doc(db, 'products', prod.id));
        }
        // Write defaults
        for (const cat of DEFAULT_CATEGORIES) {
          await setDoc(doc(db, 'categories', cat.id), cat);
        }
        for (const prod of DEFAULT_PRODUCTS) {
          await setDoc(doc(db, 'products', prod.id), prod);
        }
        await setDoc(doc(db, 'restaurant_info', 'config'), DEFAULT_RESTAURANT_INFO);
        await setDoc(doc(db, 'system', 'bootstrap'), { seeded: true }, { merge: true });
        setCart([]);
      } catch (e) {
        console.error('Error resetting database to defaults:', e);
      }
    }
  };

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        restaurantInfo,
        cart,
        orderDetails,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateOrderDetails,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateRestaurantInfo,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

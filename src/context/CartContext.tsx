import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, PricingMode, CategoryFilter } from '../types';

interface Toast {
  message: string;
  type: 'success' | 'info' | 'warn';
  id: number;
}

interface CartContextType {
  cart: CartItem[];
  pricingMode: PricingMode;
  categoryFilter: CategoryFilter;
  searchQuery: string;
  shippingRequired: boolean;
  toasts: Toast[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setPricingMode: (mode: PricingMode) => void;
  setCategoryFilter: (filter: CategoryFilter) => void;
  setSearchQuery: (query: string) => void;
  setShippingRequired: (required: boolean) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warn') => void;
  removeToast: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pricingMode, setPricingModeState] = useState<PricingMode>('retail');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shippingRequired, setShippingRequired] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // LocalStorage Persistence
  useEffect(() => {
    const savedCart = localStorage.getItem('royal_grooming_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
      }
    }
    const savedMode = localStorage.getItem('royal_grooming_pricing_mode');
    if (savedMode === 'retail' || savedMode === 'wholesale') {
      setPricingModeState(savedMode);
    }
  }, []);

  const saveCartToStorage = (newCart: CartItem[]) => {
    localStorage.setItem('royal_grooming_cart', JSON.stringify(newCart));
  };

  const setPricingMode = (mode: PricingMode) => {
    setPricingModeState(mode);
    localStorage.setItem('royal_grooming_pricing_mode', mode);
    showToast(
      mode === 'wholesale' 
        ? 'Modo Distribuidor: Mostrando precios al por mayor' 
        : 'Modo Detalle: Mostrando precios estándar', 
      'info'
    );
  };

  // Toast message helper
  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      let updatedCart: CartItem[];

      if (existingIndex > -1) {
        const item = prevCart[existingIndex];
        const newQty = item.quantity + quantity;
        updatedCart = [...prevCart];
        updatedCart[existingIndex] = { ...item, quantity: newQty };
      } else {
        updatedCart = [...prevCart, { product, quantity }];
      }

      saveCartToStorage(updatedCart);

      // Give correct feedback based on retail vs wholesale mode
      const minQty = product.minWholesaleQty;
      if (pricingMode === 'wholesale' && updatedCart.find(i => i.product.id === product.id)!.quantity < minQty) {
        showToast(
          `Agregado. Recuerda que para precio Mayorista requiere un mínimo de ${minQty} unidades de este producto.`,
          'warn'
        );
      } else {
        showToast(`"${product.name}" agregado al carrito`, 'success');
      }

      return updatedCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const product = prevCart.find((item) => item.product.id === productId)?.product;
      const updatedCart = prevCart.filter((item) => item.product.id !== productId);
      saveCartToStorage(updatedCart);
      if (product) {
        showToast(`"${product.name}" eliminado del carrito`, 'info');
      }
      return updatedCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('royal_grooming_cart');
    showToast('Carrito vaciado', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        pricingMode,
        categoryFilter,
        searchQuery,
        shippingRequired,
        toasts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setPricingMode,
        setCategoryFilter,
        setSearchQuery,
        setShippingRequired,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  compareList: string[];
  addToCart: (id: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (id: string) => void;
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      compareList: [],
      addToCart: (id, quantity = 1) => set((state) => {
        const existing = state.cart.find(item => item.id === id);
        if (existing) {
          return { cart: state.cart.map(item => item.id === id ? { ...item, quantity: item.quantity + quantity } : item) };
        }
        return { cart: [...state.cart, { id, quantity }] };
      }),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return { cart: state.cart.filter((item) => item.id !== id) };
        }
        return { cart: state.cart.map(item => item.id === id ? { ...item, quantity } : item) };
      }),
      clearCart: () => set({ cart: [] }),
      toggleCart: (id) => set((state) => {
        const exists = state.cart.some(item => item.id === id);
        if (exists) {
          return { cart: state.cart.filter(item => item.id !== id) };
        }
        return { cart: [...state.cart, { id, quantity: 1 }] };
      }),
      addToWishlist: (id) => set((state) => ({ wishlist: [...new Set([...state.wishlist, id])] })),
      removeFromWishlist: (id) => set((state) => ({ wishlist: state.wishlist.filter((item) => item !== id) })),
      toggleWishlist: (id) => set((state) => ({
        wishlist: state.wishlist.includes(id) ? state.wishlist.filter((item) => item !== id) : [...state.wishlist, id]
      })),
      addToCompare: (id) => set((state) => ({ 
        compareList: state.compareList.length < 4 ? [...new Set([...state.compareList, id])] : state.compareList 
      })),
      removeFromCompare: (id) => set((state) => ({ compareList: state.compareList.filter((item) => item !== id) })),
      toggleCompare: (id) => set((state) => {
        if (state.compareList.includes(id)) {
          return { compareList: state.compareList.filter((item) => item !== id) };
        }
        if (state.compareList.length >= 4) {
          return { compareList: state.compareList };
        }
        return { compareList: [...state.compareList, id] };
      }),
      clearCompare: () => set({ compareList: [] }),
    }),
    {
      name: 'klarone-store',
      version: 1,
    }
  )
);

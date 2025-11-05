import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addToCart, removeFromCart, updateCart, createCart, getCart } from '@/lib/shopify-client';
import { Cart } from '../../lib/shopify/types';

interface CartStore {
  cart: Cart | null;
  isCartOpen: boolean;
  isLoading: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, merchandiseId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  initializeCart: () => Promise<void>;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isCartOpen: false,
      isLoading: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      
      initializeCart: async () => {
        try {
          set({ isLoading: true });
          let cart = await getCart();
          if (!cart) {
            cart = await createCart();
          }
          set({ cart, isLoading: false });
        } catch (error) {
          console.error('Error initializing cart:', error);
          set({ isLoading: false });
        }
      },
      
      addItem: async (merchandiseId, quantity = 1) => {
        try {
          set({ isLoading: true });
          const cart = await addToCart([{ merchandiseId, quantity }]);
          set({ cart, isCartOpen: true, isLoading: false });
        } catch (error) {
          console.error('Error adding to cart:', error);
          set({ isLoading: false });
        }
      },
      
      removeItem: async (lineId) => {
        try {
          set({ isLoading: true });
          const cart = await removeFromCart([lineId]);
          set({ cart, isLoading: false });
        } catch (error) {
          console.error('Error removing from cart:', error);
          set({ isLoading: false });
        }
      },
      
      updateQuantity: async (lineId, merchandiseId, quantity) => {
        try {
          set({ isLoading: true });
          const cart = await updateCart([{ id: lineId, merchandiseId, quantity }]);
          set({ cart, isLoading: false });
        } catch (error) {
          console.error('Error updating cart:', error);
          set({ isLoading: false });
        }
      },
      
      clearCart: () => set({ cart: null })
    }),
    { 
      name: 'brewy-cart',
      partialize: (state) => ({ cart: state.cart })
    }
  )
);

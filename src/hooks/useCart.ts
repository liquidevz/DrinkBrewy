import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (variantId: string, product?: any) => Promise<void>;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      
      setCartOpen: (open) => set({ isCartOpen: open }),
      
      addItem: async (variantId, product) => {
        const items = get().items;
        const existingItem = items.find(item => item.variantId === variantId);
        
        if (existingItem) {
          // Increment quantity
          set({
            items: items.map(item =>
              item.variantId === variantId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isCartOpen: true
          });
        } else if (product) {
          // Fetch product details if not provided
          let productData = product;
          if (!productData) {
            try {
              const res = await fetch(`/api/backend/products/${variantId.split('_')[1]}`);
              if (res.ok) {
                productData = await res.json();
              }
            } catch (error) {
              console.error('Error fetching product:', error);
              return;
            }
          }
          
          // Find the variant
          const variant = productData.variants?.find((v: any) => v.id === variantId);
          
          // Add new item
          const newItem: CartItem = {
            id: `${Date.now()}`,
            variantId,
            productId: productData.id,
            name: `${productData.name} - ${variant?.title || 'Single Can'}`,
            price: variant?.price || productData.price,
            quantity: 1,
            image: productData.images?.[0]
          };
          
          set({
            items: [...items, newItem],
            isCartOpen: true
          });
        }
      },
      
      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
      },
      
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
        } else {
          set({
            items: get().items.map(item =>
              item.variantId === variantId
                ? { ...item, quantity }
                : item
            )
          });
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    { 
      name: 'brewy-cart',
      partialize: (state) => ({ items: state.items })
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to cart
      addToCart: (product, quantity = 1, size = null, color = null) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          item => item.id === product.id && item.size === size && item.color === color
        );

        if (existingItemIndex > -1) {
          // Update existing item quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            category: product.category,
            quantity,
            size,
            color,
            totalPrice: Number(product.price) * quantity
          };
          set({ items: [...items, newItem] });
        }
      },

      // Remove item from cart
      removeFromCart: (itemId, size = null, color = null) => {
        const { items } = get();
        const filteredItems = items.filter(
          item => !(item.id === itemId && item.size === size && item.color === color)
        );
        set({ items: filteredItems });
      },

      // Update item quantity
      updateQuantity: (itemId, quantity, size = null, color = null) => {
        const { items } = get();
        const updatedItems = items.map(item => {
          if (item.id === itemId && item.size === size && item.color === color) {
            return {
              ...item,
              quantity,
              totalPrice: Number(item.price) * quantity
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },

      // Get cart total
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.totalPrice, 0);
      },

      // Get cart count
      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      // Get cart items
      getCartItems: () => {
        return get().items;
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage
    }
  )
);

export default useCartStore;

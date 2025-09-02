// This hook and store are the single source of product fetching and state for the app.
// Use this everywhere you need product data. (Zustand + TanStack Query)
// Follows best practices for hooks and state management folder structure.
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Zustand store for products
export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));

// TanStack Query hook to fetch products and sync with Zustand
export function useProducts(categorySlug) {
  const setProducts = useProductStore((state) => state.setProducts);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', categorySlug || 'all'],
    queryFn: async () => {
      const url = categorySlug
        ? `http://localhost:8000/api/products/?category=${encodeURIComponent(categorySlug)}`
        : 'http://localhost:8000/api/products';
      const res = await axios.get(url);
      return res.data;
    },
    onSuccess: (data) => {
      setProducts(data);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    products: data || [],
    isLoading,
    isError,
  };
}

import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Zustand store for individual product
export const useProductStore = create((set) => ({
  product: null,
  setProduct: (product) => set({ product }),
}));

// TanStack Query hook to fetch individual product by ID
export function useProduct(productId) {
  const setProduct = useProductStore((state) => state.setProduct);
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      const url = `${import.meta.env.VITE_API_BASE_URL}/enhanced-products/${productId}/`;
      const res = await axios.get(url);
      return res.data;
    },
    onSuccess: (data) => {
      setProduct(data);
    },
    enabled: !!productId, // Only run query if productId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    product: data || null,
    isLoading,
    isError,
    error,
  };
}

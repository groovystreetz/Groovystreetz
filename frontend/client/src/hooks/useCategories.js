import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:8000/api/categories/');
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  return {
    categories: data || [],
    isLoading,
    isError,
  };
}
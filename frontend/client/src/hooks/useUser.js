import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie } from '../lib/csrf';

// Zustand store for user
export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// TanStack Query hook to fetch user and sync with Zustand
export function useUser() {
  const setUser = useUserStore((state) => state.setUser);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const csrfToken = getCookie('csrftoken');
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL + '/auth/user/', {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user: data || null,
    isLoading,
    isError,
  };
}

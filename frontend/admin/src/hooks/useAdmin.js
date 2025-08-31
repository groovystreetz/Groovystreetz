import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie } from '../lib/csrf';

// Zustand store for admin user
export const useAdminStore = create((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
}));

// TanStack Query hook to fetch admin user and sync with Zustand
export function useAdmin() {
  const setAdmin = useAdminStore((state) => state.setAdmin);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      console.log('useAdmin hook - Token from localStorage:', token);
      
      if (!token) {
        console.log('useAdmin hook - No token found');
        throw new Error('No valid token');
      }
      
      // For session-based auth, we just need to check if the flag exists
      if (token === 'session_auth') {
        console.log('useAdmin hook - Using session-based authentication');
      } else if (token === 'dummy') {
        console.log('useAdmin hook - Found dummy token, checking for stored user info');
      }

      // Try to get the actual user info from localStorage first
      const storedUserInfo = localStorage.getItem('admin_user_info');
      console.log('useAdmin hook - Stored user info:', storedUserInfo);
      
      if (storedUserInfo) {
        try {
          const userInfo = JSON.parse(storedUserInfo);
          console.log('useAdmin hook - Retrieved user info from localStorage:', userInfo);
          return userInfo;
        } catch (e) {
          console.error('useAdmin hook - Error parsing stored user info:', e);
        }
      }

      // Fallback: create a mock admin object if no stored info
      const mockAdmin = {
        id: 1,
        email: 'admin@example.com',
        role: 'admin',
        username: 'admin'
      };

      console.log('useAdmin hook - Using mock admin data');
      return mockAdmin;
    },
    onSuccess: (data) => {
      setAdmin(data);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    admin: data || null,
    isLoading,
    isError,
  };
}

// Hook to check if user is admin
export function useIsAdmin() {
  const { admin, isLoading } = useAdmin();
  
  if (isLoading) return { isAdmin: false, isLoading: true };
  
  const isAdmin = admin && (admin.role === 'admin' || admin.role === 'superadmin');
  
  return { isAdmin, isLoading: false };
}

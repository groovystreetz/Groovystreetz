import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie } from '../lib/csrf';

// Zustand store for wishlist state
export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  totalItems: 0,
  totalValue: 0,
  isLoading: false,
  setWishlist: (wishlistData) => set({
    wishlist: wishlistData.products || [],
    totalItems: wishlistData.total_items || 0,
    totalValue: wishlistData.total_value || 0,
  }),
  addToWishlist: (product) => {
    const { wishlist } = get();
    const exists = wishlist.find(item => item.id === product.id);
    if (!exists) {
      set({
        wishlist: [...wishlist, product],
        totalItems: wishlist.length + 1,
        totalValue: (parseFloat(get().totalValue) + parseFloat(product.price || 0)).toFixed(2),
      });
    }
  },
  removeFromWishlist: (productId) => {
    const { wishlist } = get();
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      set({
        wishlist: wishlist.filter(item => item.id !== productId),
        totalItems: wishlist.length - 1,
        totalValue: (parseFloat(get().totalValue) - parseFloat(product.price || 0)).toFixed(2),
      });
    }
  },
  clearWishlist: () => set({
    wishlist: [],
    totalItems: 0,
    totalValue: 0,
  }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

// API functions
const wishlistAPI = {
  // Get user's wishlist
  getWishlist: async () => {
    const csrfToken = getCookie('csrftoken');
    const response = await axios.get('http://localhost:8000/api/wishlist/', {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (productId) => {
    const csrfToken = getCookie('csrftoken');
    const response = await axios.post(`http://localhost:8000/api/wishlist/add/${productId}/`, {}, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId) => {
    const csrfToken = getCookie('csrftoken');
    const response = await axios.delete(`http://localhost:8000/api/wishlist/remove/${productId}/`, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  },

  // Toggle product in wishlist
  toggleWishlist: async (productId) => {
    const csrfToken = getCookie('csrftoken');
    const response = await axios.post(`http://localhost:8000/api/wishlist/toggle/${productId}/`, {}, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  },

  // Clear wishlist
  clearWishlist: async () => {
    const csrfToken = getCookie('csrftoken');
    const response = await axios.delete('http://localhost:8000/api/wishlist/clear/', {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  },

  // Get wishlist statistics
  getWishlistStats: async () => {
    const csrfToken = getCookie('csrftoken');
    const response = await axios.get('http://localhost:8000/api/wishlist/stats/', {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  },

  // Check if product is in wishlist
  checkInWishlist: async (productId) => {
    const csrfToken = getCookie('csrftoken');
    const response = await axios.get(`http://localhost:8000/api/wishlist/check/${productId}/`, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  },
};

// Main wishlist hook
export function useWishlist() {
  const queryClient = useQueryClient();
  const {
    wishlist,
    totalItems,
    totalValue,
    isLoading: storeLoading,
    setWishlist,
    clearWishlist: clearWishlistStore,
    setLoading,
  } = useWishlistStore();

  // Query for wishlist data
  const {
    isLoading: isLoadingWishlist,
    isError: isErrorWishlist,
    refetch: refetchWishlist,
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistAPI.getWishlist,
    onSuccess: (data) => {
      setWishlist(data);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for adding to wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: wishlistAPI.addToWishlist,
    onSuccess: (data) => {
      // Log the API response to understand the structure
      console.log('Add to wishlist API response:', data);
      
      // The API response doesn't include the product object, so we just invalidate queries
      // to refetch the updated wishlist data
      queryClient.invalidateQueries(['wishlist']);
      queryClient.invalidateQueries(['wishlist-check']);
      // Show success message
      console.log(data.message);
    },
    onError: (error) => {
      console.error('Failed to add to wishlist:', error);
      // Revert local state on error
      queryClient.invalidateQueries(['wishlist-check']);
    },
  });

  // Mutation for removing from wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: wishlistAPI.removeFromWishlist,
    onSuccess: (data) => {
      // Log the API response to understand the structure
      console.log('Remove from wishlist API response:', data);
      
      // The API response doesn't include the product object, so we just invalidate queries
      // to refetch the updated wishlist data
      queryClient.invalidateQueries(['wishlist']);
      queryClient.invalidateQueries(['wishlist-check']);
      // Show success message
      console.log(data.message);
    },
    onError: (error) => {
      console.error('Failed to remove from wishlist:', error);
      // Revert local state on error
      queryClient.invalidateQueries(['wishlist-check']);
    },
  });

  // Mutation for toggling wishlist
  const toggleWishlistMutation = useMutation({
    mutationFn: wishlistAPI.toggleWishlist,
    onSuccess: (data) => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries(['wishlist']);
      // Show success message
      console.log(data.message);
    },
    onError: (error) => {
      console.error('Failed to toggle wishlist:', error);
    },
  });

  // Mutation for clearing wishlist
  const clearWishlistMutation = useMutation({
    mutationFn: wishlistAPI.clearWishlist,
    onSuccess: (data) => {
      // Update local state
      clearWishlistStore();
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries(['wishlist']);
      // Show success message
      console.log(data.message);
    },
    onError: (error) => {
      console.error('Failed to clear wishlist:', error);
    },
  });

  // Function to add product to wishlist
  const addToWishlist = (productId) => {
    setLoading(true);
    addToWishlistMutation.mutate(productId, {
      onSettled: () => setLoading(false),
    });
  };

  // Function to remove product from wishlist
  const removeFromWishlist = (productId) => {
    setLoading(true);
    removeFromWishlistMutation.mutate(productId, {
      onSettled: () => setLoading(false),
    });
  };

  // Function to toggle product in wishlist
  const toggleWishlist = (productId) => {
    setLoading(true);
    toggleWishlistMutation.mutate(productId, {
      onSettled: () => setLoading(false),
    });
  };

  // Function to clear wishlist
  const clearWishlist = () => {
    setLoading(true);
    clearWishlistMutation.mutate(undefined, {
      onSettled: () => setLoading(false),
    });
  };

  // Check if a product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return {
    // State
    wishlist,
    totalItems,
    totalValue,
    isLoading: isLoadingWishlist || storeLoading,
    isError: isErrorWishlist,
    
    // Actions
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    refetchWishlist,
    
    // Mutations (for advanced usage)
    addToWishlistMutation,
    removeFromWishlistMutation,
    toggleWishlistMutation,
    clearWishlistMutation,
  };
}

// Hook for checking if a specific product is in wishlist
export function useWishlistCheck(productId) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['wishlist-check', productId],
    queryFn: () => wishlistAPI.checkInWishlist(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    isInWishlist: data?.in_wishlist || false,
    isLoading,
    isError,
  };
}

// Hook for wishlist statistics
export function useWishlistStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['wishlist-stats'],
    queryFn: wishlistAPI.getWishlistStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    stats: data || {},
    isLoading,
    isError,
  };
}
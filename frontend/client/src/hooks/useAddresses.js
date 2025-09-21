import { useState } from 'react';
import axios from 'axios';
import { getCookie } from '../lib/csrf';

export const useAddresses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAddress = async (addressData) => {
    setLoading(true);
    setError(null);
    
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + '/enhanced-addresses/',
        addressData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        }
      );
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create address';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAddresses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_BASE_URL + '/enhanced-addresses/',
        {
          withCredentials: true,
        }
      );
      
      // Handle both array response and paginated response
      return Array.isArray(response.data) ? response.data : response.data.results || response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch addresses';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId, addressData) => {
    setLoading(true);
    setError(null);
    
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.put(
        import.meta.env.VITE_API_BASE_URL + `/enhanced-addresses/${addressId}/`,
        addressData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        }
      );
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to update address';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    setLoading(true);
    setError(null);
    
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.delete(
        import.meta.env.VITE_API_BASE_URL + `/enhanced-addresses/${addressId}/`,
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken,
          },
        }
      );
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete address';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (addressId) => {
    setLoading(true);
    setError(null);
    
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.patch(
        import.meta.env.VITE_API_BASE_URL + `/enhanced-addresses/${addressId}/set-default/`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        }
      );
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to set default address';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    loading,
    error,
  };
};
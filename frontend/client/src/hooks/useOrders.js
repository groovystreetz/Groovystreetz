import { useState } from 'react';
import axios from 'axios';
import { getCookie } from '../lib/csrf';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + '/orders/create/',
        orderData,
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
      const errorMessage = err.response?.data?.detail || 'Failed to create order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
    error,
  };
};

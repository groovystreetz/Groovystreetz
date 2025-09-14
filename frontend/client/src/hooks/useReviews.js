import { useState } from 'react';
import axios from 'axios';
import { getCookie } from '../lib/csrf';

export const useReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReview = async (reviewData) => {
    setLoading(true);
    setError(null);
    
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + '/reviews/',
        reviewData,
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
      const errorMessage = err.response?.data?.detail || 'Failed to create review';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getReviews = async (productId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_BASE_URL + `/reviews/?product=${productId}`,
        {
          withCredentials: true,
        }
      );
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch reviews';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createReview,
    getReviews,
    loading,
    error,
  };
};

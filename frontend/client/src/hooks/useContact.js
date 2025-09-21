import { useState } from 'react';
import axios from 'axios';
import { getCookie } from '../lib/csrf';

export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitContactForm = async (contactData) => {
    setLoading(true);
    setError(null);
    
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + '/contact/',
        contactData,
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
      let errorMessage = 'Failed to submit contact form';
      
      if (err.response?.data) {
        // Handle field-specific validation errors
        if (typeof err.response.data === 'object') {
          const fieldErrors = Object.entries(err.response.data)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          errorMessage = fieldErrors || err.response.data.detail || err.response.data.message;
        } else {
          errorMessage = err.response.data;
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    submitContactForm,
    loading,
    error,
  };
};
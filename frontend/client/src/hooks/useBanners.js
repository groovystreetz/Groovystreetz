import { useState } from 'react';
import axios from 'axios';
// import { getCookie } from '../lib/csrf';

export const useBanners = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getBanners = async (bannerType = 'hero') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_BASE_URL + `/banners/?type=${bannerType}`,
        {
          withCredentials: true,
        }
      );
      
      // Handle both array response and paginated response
      return Array.isArray(response.data) ? response.data : response.data.results || response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch banners';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getHeroBanners = async () => {
    return getBanners('hero');
  };

  const getBannerBanners = async () => {
    return getBanners('banner');
  };

  const getPromoBanners = async () => {
    return getBanners('promo');
  };

  return {
    getBanners,
    getHeroBanners,
    getBannerBanners,
    getPromoBanners,
    loading,
    error,
  };
};
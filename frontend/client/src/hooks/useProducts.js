import { useState, useCallback } from 'react';
import axios from 'axios';

export const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append('search', params.search);
      if (params.gender) queryParams.append('gender', params.gender);
      if (params.categories) {
        const categories = Array.isArray(params.categories)
          ? params.categories.join(',')
          : params.categories;
        queryParams.append('categories', categories);
      }
      if (params.min_price) queryParams.append('min_price', params.min_price);
      if (params.max_price) queryParams.append('max_price', params.max_price);
      if (params.new_arrivals !== undefined) queryParams.append('new_arrivals', params.new_arrivals);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await axios.get(
        import.meta.env.VITE_API_BASE_URL + `/enhanced-products/?${queryParams.toString()}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch products';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMenProducts = useCallback(async (params = {}) => {
    return getProducts({ ...params, gender: 'male' });
  }, [getProducts]);

  const getWomenProducts = useCallback(async (params = {}) => {
    return getProducts({ ...params, gender: 'female' });
  }, [getProducts]);

  const getUnisexProducts = useCallback(async (params = {}) => {
    return getProducts({ ...params, gender: 'unisex' });
  }, [getProducts]);

  const getProductsByCategory = useCallback(async (category, params = {}) => {
    return getProducts({ ...params, categories: category });
  }, [getProducts]);

  const getNewArrivals = useCallback(async (params = {}) => {
    return getProducts({ ...params, new_arrivals: true });
  }, [getProducts]);

  const searchProducts = useCallback(async (searchTerm, params = {}) => {
    return getProducts({ ...params, search: searchTerm });
  }, [getProducts]);

  const getProductsByPriceRange = useCallback(async (minPrice, maxPrice, params = {}) => {
    return getProducts({ ...params, min_price: minPrice, max_price: maxPrice });
  }, [getProducts]);

  return {
    getProducts,
    getMenProducts,
    getWomenProducts,
    getUnisexProducts,
    getProductsByCategory,
    getNewArrivals,
    searchProducts,
    getProductsByPriceRange,
    loading,
    error,
  };
};
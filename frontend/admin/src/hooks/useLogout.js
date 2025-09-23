import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://127.0.0.1:8000";

console.log('API_BASE_URL from env:', API_BASE_URL);

const logoutUser = async () => {
  const token = localStorage.getItem('token');
  
  // if (!token) {
  //   throw new Error('No token found');
  // }

  console.log('Making logout API call to:', `${API_BASE_URL}/api/logout/`);
  console.log('Token:', token ? 'Token exists' : 'No token');
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/logout/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Logout API response:', response);
    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    // Re-throw the error so the mutation knows it failed
    throw error;
  }
};

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      console.log('Logout mutation success:', data);
      // Clear token from localStorage
      localStorage.removeItem('token');
      // Navigate to login page
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout mutation failed:', error);
      // Even on error, clear the token and navigate to login
      localStorage.removeItem('token');
      navigate('/login');
    },
  });
};
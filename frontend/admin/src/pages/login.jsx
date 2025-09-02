import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { getCookie } from '../lib/csrf';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    return newErrors;
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ email: true, password: true });
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        const csrfToken = getCookie('csrftoken');
        const response = await axios.post(
          'http://localhost:8000/api/login/',
          { email, password },
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': csrfToken,
            },
          }
        );
        
        // Debug logging
        console.log('Full response:', response);
        console.log('Response data:', response.data);
        console.log('User role from response:', response.data?.role);
        
        // Since backend uses session-based auth, we'll store a session flag
        // The actual authentication is handled by Django sessions and cookies
        localStorage.setItem('admin_token', 'session_auth');
        console.log('Using session-based authentication');
        
        // Verify session flag was stored
        const storedAuth = localStorage.getItem('admin_token');
        console.log('Stored auth flag in localStorage:', storedAuth);
        
        // Store user information for frontend use
        if (response.data) {
          const userInfo = {
            id: response.data.pk || response.data.id || 1,
            email: response.data.email || email,
            role: response.data.role || 'admin',
            username: response.data.username || email.split('@')[0],
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || ''
          };
          localStorage.setItem('admin_user_info', JSON.stringify(userInfo));
          
          // Debug logging
          console.log('User info stored:', userInfo);
          console.log('User role:', userInfo.role);
        }
        
        // Check if user has admin privileges
        if (response.data && (response.data.role === 'admin' || response.data.role === 'superadmin')) {
          console.log('User has admin privileges, redirecting to dashboard...');
          
          // Try multiple navigation methods
          try {
            // First try React Router navigation
            navigate('/dashboard');
            
            // Fallback: if navigation doesn't work after a short delay, use window.location
            setTimeout(() => {
              if (window.location.pathname !== '/dashboard') {
                console.log('React Router navigation failed, using window.location');
                window.location.href = '/dashboard';
              }
            }, 100);
          } catch (navError) {
            console.log('Navigation error, using window.location:', navError);
            window.location.href = '/dashboard';
          }
        } else {
          console.log('User does not have admin privileges');
          alert('Access denied. Admin privileges required.');
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user_info');
        }
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors({ api: error.response.data.detail || 'Login failed.' });
        } else {
          setErrors({ api: 'Login failed. Please try again.' });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-3xl shadow-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 p-10 flex flex-col justify-between relative">
          <div>
            <h2 className="text-white text-4xl font-bold mb-4 leading-tight">
              Admin<br />Dashboard<br />Access
            </h2>
            <p className="text-blue-100 mb-8">
              Secure access to the Groovystreetz admin panel for platform management and user oversight.
            </p>
          </div>
          {/* Admin Icon */}
          <div className="flex justify-center items-end">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Right Side */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mr-3">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
            <span className="font-bold text-xl">Admin Panel</span>
          </div>
          
          {/* Welcome Text */}
          <h2 className="text-2xl font-bold mb-2">Admin Access</h2>
          <p className="text-gray-500 mb-6">Sign in with your admin credentials</p>
          
          {/* Login Form */}
          <form className="space-y-4 mb-4" onSubmit={handleSubmit} noValidate>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Admin email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.email && touched.email ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>
              )}
              {errors.api && (
                <p className="text-red-500 text-xs mt-1 text-left">{errors.api}</p>
              )}
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${errors.password && touched.password ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xl"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1 absolute left-0 -bottom-5">{errors.password}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Only authorized administrators can access this panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

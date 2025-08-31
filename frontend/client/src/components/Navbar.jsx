import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaUserCircle,
  FaHeart,
  FaTruck,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";
import useCartStore from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);
  const navigate = useNavigate();
  const { getCartCount } = useCartStore();
  const { totalItems: wishlistCount } = useWishlist();
  
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  // Handle scroll to toggle shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://127.0.0.1:8000/api/logout/', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage and redirect regardless of API response
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleProfileMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setShowProfileMenu(true);
  };

  const handleProfileMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowProfileMenu(false);
    }, 300); // 300ms delay before hiding
    setHideTimeout(timeout);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 py-3 z-50 transition-all duration-300 backdrop-blur-md
        ${isAtTop ? "bg-white shadow-sm" : "bg-white/90 shadow-md"}`}
    >
      {/* Hamburger */}
      <div className="flex items-center">
        <IconButton onClick={() => setDrawerOpen(true)} edge="start">
          <MenuIcon sx={{ color: "black" }} />
        </IconButton>
      </div>

      {/* Centered Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </div>
      </div>

      {/* Right Section: Search + Icons */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Search Box */}
        {/* <div className="relative hidden md:block w-full max-w-xs">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div> */}

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon with Badge */}
          <div className="relative">
            <FaShoppingCart
              onClick={() => navigate('/cart')}
              className="text-xl text-gray-700 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-black"
            />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            )}
          </div>
          
          {/* Wishlist Icon with Badge */}
          <div className="relative">
            <FaHeart
              onClick={() => navigate('/wishlist')}
              className="text-xl text-gray-700 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-black"
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </div>
          
          {/* Truck Icon */}
          <FaTruck className="text-xl text-gray-700 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-black" />
          
          {/* Profile/Login Section */}
          {isAuthenticated ? (
            <div 
              className="relative"
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              <FaUserCircle
                className="text-xl text-gray-700 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-black"
              />
              
                             {/* Profile Dropdown Menu */}
               {showProfileMenu && (
                 <div 
                   className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                   onMouseEnter={handleProfileMouseEnter}
                   onMouseLeave={handleProfileMouseLeave}
                 >
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <FaUserCircle className="text-gray-500" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <FaSignOutAlt className="text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Side Menu */}
      <SideMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </nav>
  );
};

export default Navbar;

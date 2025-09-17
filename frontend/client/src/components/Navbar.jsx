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
import { useNavigate, useLocation } from "react-router-dom";
import useCartStore from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCartStore();
  const { totalItems: wishlistCount } = useWishlist();

  const isAuthenticated = !!localStorage.getItem("token");

  // Navigation items
  const navItems = [
    { label: "Man", path: "/products?categories=man" },
    { label: "Women", path: "/products?categories=women" },
    { label: "Groovy Streetz", path: "/products?categories=groovy-street" },
  ];

  // Check if current path matches navigation item
  const isActiveNavItem = (path) => {
    return location.pathname === "/products" && location.search.includes(path.split("=")[1]);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      navigate(`/products?search=${encodedQuery}`);
    }
  };

  // Handle scroll to toggle shadow + background
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
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "http://127.0.0.1:8000/api/logout/",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
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
    }, 300);
    setHideTimeout(timeout);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 py-3 z-50 transition-all duration-300 backdrop-blur-md border-b
        ${
          isAtTop
            ? "bg-[#F57C26] border-[#d86a1f] shadow-md"
            : "bg-white/80 border-gray-200 shadow-lg"
        }`}
    >
      {/* Left Section: Hamburger + Navigation Links */}
      <div className="flex items-center space-x-6">
        <IconButton onClick={() => setDrawerOpen(true)} edge="start">
          <MenuIcon sx={{ color: isAtTop ? "#FFFFFF" : "#1F2937" }} />
        </IconButton>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => navigate(item.path)}
                className={`relative px-3 py-2  text-base font-medium bg-transparent border-none focus:outline-none transition-all duration-300 tracking-wider ${
                  isAtTop 
                    ? "text-white hover:text-white/90" 
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {item.label}
                {/* Animated Bottom Border */}
                <div
                  className={`absolute bottom-0 left-0 h-0.5 transition-all duration-500 ease-in-out ${
                    isActiveNavItem(item.path)
                      ? `w-full ${isAtTop ? "bg-white" : "bg-[#F57C26]"}`
                      : "w-0 bg-transparent"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Centered Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto drop-shadow-[0_1px_0_rgba(234,88,12,0.2)]"
          />
        </div>
      </div>

      {/* Right Section: Search + Icons */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Search Box */}
        <form onSubmit={handleSearch} className="relative hidden md:block w-full max-w-xs">
          <button
            type="submit"
            className={`absolute top-1/2 bg-transparent left-0 transform -translate-y-1/2 ${
              isAtTop ? "text-gray-200 hover:text-white" : "text-gray-400 hover:text-gray-600"
            } transition-colors cursor-pointer`}
          >
            <FaSearch />
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-1 rounded-full border ${
              isAtTop
                ? "border-white/30 bg-white/20 text-white placeholder-white/60 focus:ring-white"
                : "border-gray-300 bg-gray-50 text-black placeholder-gray-400 focus:ring-gray-500"
            } focus:outline-none focus:ring-2`}
          />
        </form>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <div className="relative">
            <FaShoppingCart
              onClick={() => navigate("/cart")}
              className={`text-xl cursor-pointer transition-transform duration-200 hover:scale-110 ${
                isAtTop ? "text-white hover:text-white/90" : "text-gray-700 hover:text-gray-900"
              }`}
            />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F57C26] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            )}
          </div>

          {/* Wishlist Icon */}
          <div className="relative">
            <FaHeart
              onClick={() => navigate("/wishlist")}
              className={`text-xl cursor-pointer transition-transform duration-200 hover:scale-110 ${
                isAtTop ? "text-white hover:text-white/90" : "text-gray-700 hover:text-gray-900"
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F57C26] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Truck Icon */}
          <FaTruck
            className={`text-xl cursor-pointer transition-transform duration-200 hover:scale-110 ${
              isAtTop ? "text-white hover:text-white/90" : "text-gray-700 hover:text-gray-900"
            }`}
          />

          {/* Profile/Login Section */}
          {isAuthenticated ? (
            <div
              className="relative"
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              <FaUserCircle
                className={`text-xl cursor-pointer transition-transform duration-200 hover:scale-110 ${
                  isAtTop ? "text-white hover:text-white/90" : "text-gray-700 hover:text-gray-900"
                }`}
              />

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  onMouseEnter={handleProfileMouseEnter}
                  onMouseLeave={handleProfileMouseLeave}
                >
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <FaUserCircle className="text-gray-500" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <FaSignOutAlt className="text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAtTop
                  ? "bg-white text-[#F57C26] hover:bg-orange-50"
                  : "bg-[#F57C26] text-white hover:bg-[#e76e1f]"
              }`}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Side Menu */}
      <SideMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isLoggedIn={isAuthenticated}
      />
    </nav>
  );
};

export default Navbar;

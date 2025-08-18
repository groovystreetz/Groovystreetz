import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaUserCircle,
  FaHeart,
  FaTruck,
  FaSearch,
} from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const navigate = useNavigate();

  // Handle scroll to toggle shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div onClick={() => navigate("/homepage")} className="cursor-pointer">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </div>
      </div>

      {/* Right Section: Search + Icons */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Search Box */}
        <div className="relative hidden md:block w-full max-w-xs">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Icons */}
        {[FaShoppingCart, FaHeart, FaTruck, FaUserCircle].map(
          (Icon, index) => (
            <Icon
              key={index}
              className="text-xl text-gray-700 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-black"
            />
          )
        )}
      </div>

      {/* Side Menu */}
      <SideMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </nav>
  );
};

export default Navbar;

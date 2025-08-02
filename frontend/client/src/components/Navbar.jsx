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

  // Handle scroll to toggle transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // set initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 py-3 shadow z-50 transition-all duration-300 backdrop-blur-md ${
        isAtTop ? "bg-orange-500" : "bg-orange-500/30"
      }`}
    >
      {/* Hamburger */}
      <div className="flex items-center">
        <IconButton onClick={() => setDrawerOpen(true)} edge="start">
          <MenuIcon sx={{ color: "white" }} />
        </IconButton>
      </div>

      {/* Centered Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div
          onClick={() => navigate("/homepage")}
          className="cursor-pointer"
        >
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </div>
      </div>

      {/* Right Section: Search + Icons */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Search Box */}
        <div className="relative hidden md:block w-full max-w-xs">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-black bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Icons */}
        {[FaShoppingCart, FaHeart, FaTruck, FaUserCircle].map((Icon, index) => (
          <Icon
            key={index}
            className="text-2xl text-white cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:text-orange-300"
          />
        ))}
      </div>

      {/* Side Menu */}
      <SideMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </nav>
  );
};

export default Navbar;

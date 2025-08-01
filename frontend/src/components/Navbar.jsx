import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaUserCircle, FaHeart, FaTruck, FaSearch } from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import SideMenu from "./SideMenu";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll behavior: hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 py-3 bg-orange-500 shadow z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Hamburger */}
      <div className="flex items-center">
        <IconButton onClick={() => setDrawerOpen(true)} edge="start">
          <MenuIcon sx={{ color: "black" }} />
        </IconButton>
      </div>

      {/* Logo */}
      <div className="flex-1 flex justify-center">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
      </div>

      {/* Search, Cart, Wishlist, TrackOrder, Profile */}
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block w-full max-w-xs">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-black bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <FaShoppingCart className="text-2xl text-black cursor-pointer" />
        <FaHeart className="text-2xl text-black cursor-pointer" title="Wishlist" />
        <FaTruck className="text-2xl text-black cursor-pointer" title="Track Your Order" />
        <FaUserCircle className="text-2xl text-black cursor-pointer" />
      </div>

      {/* Side Menu */}
      <SideMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </nav>
  );
};

export default Navbar;

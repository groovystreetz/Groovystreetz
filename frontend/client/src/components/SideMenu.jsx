import React from "react";
import Drawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserAlt } from "react-icons/fa";

const categories = [
  "Urban Monk",
  "Urban Animals",
  "Rockstar",
  "Kids",
  "Women",
  "Men",
];

const lowerLinks = [
  "My Account",
  "Contact Us",
  "Careers",
  "Community Initiatives",
  "About Us",
  "T&C",
  "Privacy Policy",
  "FAQs",
  "Get Notified",
];

const SideMenu = ({ open, onClose, isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { overflow: "hidden" },
      }}
    >
      <div className="w-64 h-full flex flex-col bg-white text-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <img src="/logo.png" alt="Logo" className="h-10" />
          {!isLoggedIn ? (
            <button
              className="px-4 py-1 rounded-full bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
              onClick={() => {
                onClose();
                navigate("/login");
              }}
            >
              Login
            </button>
          ) : (
            <button
              className="px-4 py-1 rounded-full bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
              onClick={() => {
                onClose();
                navigate("/signup");
              }}
            >
              Signup
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex-grow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Categories</h3>
            <button
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
            >
              <FaShoppingCart className="text-base" />
              Cart
            </button>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  onClose();
                  navigate(`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`);
                }}
                className="cursor-pointer px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200"
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-gray-200 p-4 text-sm">
          <div className="space-y-2">
            {lowerLinks.map((link) => (
              <div
                key={link}
                onClick={() => {
                  onClose();
                  navigate(`/${link.toLowerCase().replace(/\s+/g, "-")}`);
                }}
                className="cursor-pointer px-2 py-1 rounded hover:bg-gray-100 hover:text-black transition-all duration-200"
              >
                {link}
              </div>
            ))}
          </div>

          {/* Profile button at bottom */}
          <button
            className="mt-6 flex items-center gap-2 px-3 py-2 rounded-md bg-black text-white w-full justify-center font-medium hover:bg-gray-800 transition-colors"
            onClick={() => {
              onClose();
              navigate("/account");
            }}
          >
            <FaUserAlt className="text-sm" />
            My Profile
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default SideMenu;

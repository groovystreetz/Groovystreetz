import React from "react";
import Drawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserAlt } from "react-icons/fa";
import { useCategories } from "@/hooks/useCategories";

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
  const { categories, isLoading } = useCategories();

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
        <div className="flex items-center justify-between p-4 border-b border-orange-100">
          <img src="/logo.png" alt="Logo" className="h-10 drop-shadow-[0_1px_0_rgba(234,88,12,0.2)]" />
          {!isLoggedIn ? (
            <button
              className="px-4 py-1 rounded-full bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors shadow-sm hover:shadow"
              onClick={() => {
                onClose();
                navigate("/login");
              }}
            >
              Login
            </button>
          ) : (
            <button
              className="px-4 py-1 rounded-full bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors shadow-sm hover:shadow"
              onClick={() => {
                onClose();
                navigate("/signup");
              }}
            >
              Signup
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <div className="p-4 border-b border-orange-100">
          <h3 className="font-semibold text-lg text-orange-700 mb-3">Shop</h3>
          <div className="space-y-2">
            {[
              { label: "Man", path: "/products?categories=man" },
              { label: "Women", path: "/products?categories=women" },
              { label: "Groovy Street", path: "/products?categories=groovy-street" },
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  onClose();
                  navigate(item.path);
                }}
                className="cursor-pointer px-2 py-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-800 transition-all duration-200"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex-grow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg text-orange-700">Categories</h3>
            <button
              className="flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-800 transition-colors"
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
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading categories...</div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.slug}
                  onClick={() => {
                    onClose();
                    navigate(`/products?category=${cat.slug}`);
                  }}
                  className="cursor-pointer px-2 py-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-800 transition-all duration-200"
                >
                  {cat.name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-orange-100 p-4 text-sm">
          <div className="space-y-2">
            {lowerLinks.map((link) => (
              <div
                key={link}
                onClick={() => {
                  onClose();
                  navigate(`/${link.toLowerCase().replace(/\s+/g, "-")}`);
                }}
                className="cursor-pointer px-2 py-1 rounded hover:bg-orange-50 hover:text-orange-800 transition-all duration-200"
              >
                {link}
              </div>
            ))}
          </div>

          {/* Profile button at bottom */}
          <button
            className="mt-6 flex items-center gap-2 px-3 py-2 rounded-md bg-orange-600 text-white w-full justify-center font-medium hover:bg-orange-700 transition-colors shadow-sm hover:shadow"
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

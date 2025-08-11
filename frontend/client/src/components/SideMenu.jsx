import React from "react";
import Drawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";

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
      <div
        className="w-64 h-full flex flex-col overflow-y-auto p-4"
        style={{
          background: "linear-gradient(135deg, #f97316, #c2410c)", // orange gradient bg
          color: "black",
        }}
      >
        <div className="flex-grow">
          {/* Logo and Auth Button */}
          <div className="flex flex-row items-center justify-between mb-3">
            <img src="/logo.png" alt="Logo" className="h-10" />
            {!isLoggedIn ? (
              <button
                className="px-4 py-1 rounded bg-black text-orange-400 font-semibold hover:bg-gray-800 hover:text-orange-500 transition-colors duration-300 ease-in-out"
                onClick={() => {
                  onClose();
                  navigate("/login");
                }}
              >
                Login
              </button>
            ) : (
              <button
                className="px-4 py-1 rounded bg-black text-orange-400 font-semibold hover:bg-gray-800 hover:text-orange-500 transition-colors duration-300 ease-in-out"
                onClick={() => {
                  onClose();
                  navigate("/signup");
                }}
              >
                Signup
              </button>
            )}
          </div>

          {/* Categories and Cart on same line */}
          <div className="mb-4 flex items-center justify-between">
            <div className="font-bold text-lg">Categories</div>
            <button
              className="font-semibold text-black hover:text-orange-500 transition-colors duration-300 ease-in-out hover:scale-105 transform"
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
            >
              🤍 Cart
            </button>
          </div>

          {/* Categories with spin-upwards hover animation */}
          {categories.map((cat) => (
            <div
              key={cat}
              className="mb-2 cursor-pointer transition-transform duration-500 ease-in-out"
              onClick={() => {
                onClose();
                navigate(`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`);
              }}
              style={{ perspective: "400px" }} // needed for 3D rotation
            >
              <span
                className="inline-block text-black"
                style={{
                  display: "inline-block",
                  transition: "transform 0.5s ease-in-out, color 0.3s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "rotateX(-360deg) translateY(-5px)";
                  e.currentTarget.style.color = "#f97316"; // orange on hover
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.color = "black";
                }}
              >
                {cat}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-black pt-4 text-sm">
          {/* Lower links with spin-upwards hover animation */}
          {lowerLinks.map((link) => (
            <div
              key={link}
              className="mb-2 cursor-pointer transition-transform duration-500 ease-in-out"
              onClick={() => {
                onClose();
                navigate(`/${link.toLowerCase().replace(/\s+/g, "-")}`);
              }}
              style={{ perspective: "400px" }}
            >
              <span
                className="inline-block text-black"
                style={{
                  display: "inline-block",
                  transition: "transform 0.5s ease-in-out, color 0.3s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "rotateX(-360deg) translateY(-5px)";
                  e.currentTarget.style.color = "#f97316";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.color = "black";
                }}
              >
                {link}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};

export default SideMenu;

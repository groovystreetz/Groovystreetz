import React, { useState } from "react";

const products = [
  { id: 1, name: "Banner 1", image: "/images/Banners1.jpg" },
  { id: 2, name: "Banner 2", image: "/images/Banners2.jpg" },
  { id: 3, name: "Banner 3", image: "/images/Banners3.jpg" },
];

const Banners = () => {
  const [hoveredIndex, setHoveredIndex] = useState(1); // Middle one big by default

  return (
    <div className="w-full mx-auto py-12">
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 tracking-tight">
        Banners
      </h2>

      <div className="flex gap-6 w-[100%] items-center transition-all duration-500">
        {products.map((product, idx) => (
          <div
            key={product.id}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(1)} // Reset to middle on leave
            className={`transition-all duration-500 cursor-pointer rounded-2xl bg-white shadow-lg overflow-hidden flex flex-col items-center ${
              hoveredIndex === idx ? "flex-[2] scale-105 shadow-2xl" : "flex-[1] scale-95"
            }`}
          >
            <div className="overflow-hidden w-full h-56">
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  hoveredIndex === idx ? "scale-110" : "scale-100"
                }`}
              />
            </div>
            <p className="text-sm font-medium text-gray-800 py-3">
              {product.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banners;

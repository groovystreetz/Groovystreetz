import React, { useState } from "react";

const products = [
  { id: 1, name: "Banner 1", image: "/images/Banners1.jpg" },
  { id: 2, name: "Banner 2", image: "/images/Banners2.jpg" },
  { id: 3, name: "Banner 3", image: "/images/Banners3.jpg" },
];

const Banners = () => {
  const [hoveredIndex, setHoveredIndex] = useState(1); // Middle one big by default

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Banners</h2>

      <div className="flex gap-4 items-center transition-all duration-500">
        {products.map((product, idx) => (
          <div
            key={product.id}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(1)} // Reset to middle on leave
            className={`transition-all duration-500 cursor-pointer border border-black shadow-md bg-white p-4 flex flex-col items-center ${
              hoveredIndex === idx ? "flex-[2]" : "flex-[1]"
            }`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover mb-2 transition-all duration-500"
            />
            <p className="text-sm font-semibold text-black">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banners;

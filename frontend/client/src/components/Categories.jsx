import React from "react";
import { motion as Motion } from "framer-motion";
import { useCategories } from "../hooks/useCategories";

// Fallback images for categories without images
const fallbackImages = {
  "streetwear": "https://images.unsplash.com/photo-1618354691535-7d1b2cf65f22",
  "accessories": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "footwear": "https://images.unsplash.com/photo-1549298916-b41d501d3772",
  "electronics": "https://images.unsplash.com/photo-1602810318383-e82b08de9d1f",
  "default": "https://images.unsplash.com/photo-1593032465175-8f7f944893a1"
};

// Map index to transform origin for growing effect
const originMap = {
  0: "bottom center",
  1: "center right",
  2: "top center",
  3: "center left",
};

const Categories = () => {
  const { categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <div className="w-screen mx-auto max-w-[95%] pt-4 pb-12 mt-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-black tracking-wide">
          CATEGORIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 h-72 rounded-lg"></div>
              <div className="h-4 bg-gray-300 rounded mt-3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full mx-auto max-w-[95%] pt-4 pb-12 mt-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-black tracking-wide">
          CATEGORIES
        </h2>
        <div className="text-center text-red-500">
          Failed to load categories. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-[95%] pt-4 pb-12 mt-14">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-black tracking-wide">
        CATEGORIES
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {categories.map((category, index) => {
          const imageSrc = category.image || fallbackImages[category.slug] || fallbackImages.default;
          
          return (
            <Motion.div
              key={category.id}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ transformOrigin: originMap[index % 4] }}
              className="flex flex-col cursor-pointer"
            >
              <div className="shadow-lg p-0 flex justify-center items-center overflow-hidden">
                <img
                  src={imageSrc}
                  alt={category.name}
                  className="w-full h-72 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <span className="mt-3 text-sm md:text-base font-medium text-gray-900 text-center tracking-wide">
                {category.name.toUpperCase()}
              </span>
            </Motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;

import React from "react";
import { motion as Motion } from "framer-motion";

// Example images (replace with your actual ones in /images/)
const categoryImages = [
  { src: "https://images.unsplash.com/photo-1618354691535-7d1b2cf65f22", alt: "OVERSIZED T-SHIRT" },
  { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", alt: "ALL BOTTOMS" },
  { src: "https://images.unsplash.com/photo-1602810318383-e82b08de9d1f", alt: "SHIRTS" },
  { src: "https://images.unsplash.com/photo-1593032465175-8f7f944893a1", alt: "POLOS" },
  { src: "https://images.unsplash.com/photo-1618354586796-c46f0e02d6b2", alt: "SHORTS" },
  { src: "https://images.unsplash.com/photo-1549298916-b41d501d3772", alt: "SNEAKERS" },
  { src: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", alt: "BOXERS" },
  { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", alt: "BACKPACKS" },
];

// Map index to transform origin for growing effect
const originMap = {
  0: "bottom center",
  1: "center right",
  2: "top center",
  3: "center left",
};

const Categories = () => (
  <div className="w-full  mx-auto max-w-[95%] pt-4 pb-12 mt-14">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-black tracking-wide">
      CATEGORIES
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {categoryImages.map((img, index) => (
        <Motion.div
          key={`${img.alt}-${index}`}
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
              src={img.src}
              alt={img.alt}
              className="w-full h-72 object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <span className="mt-3 text-sm md:text-base font-medium text-gray-900 text-center tracking-wide">
            {img.alt}
          </span>
        </Motion.div>
      ))}
    </div>
  </div>
);

export default Categories;

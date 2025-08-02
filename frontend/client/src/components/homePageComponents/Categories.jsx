import React from "react";
import { motion } from "framer-motion";

const categoryImages = [
  { src: "/images/urban-monk.jpg", alt: "OVERSIZED T-SHIRT" },
  { src: "/images/urban-animals.jpg", alt: "ALL BOTTOMS" },
  { src: "/images/rockstar.jpg", alt: "SHIRTS" },
  { src: "/images/kids.jpg", alt: "POLOS" },
  { src: "/images/women.jpg", alt: "SHORTS" },
  { src: "/images/men.jpg", alt: "SNEAKERS" },
  { src: "/images/women.jpg", alt: "BOXERS" },
  { src: "/images/women.jpg", alt: "BACKPACKS" },
];

// Map index to transform origin for growing effect
const originMap = {
  0: "bottom center",
  1: "center right",
  2: "top center",
  3: "center left",
};

const Categories = () => (
  <div className="w-full max-w-6xl mx-auto pt-4 pb-8 mt-14">
    <h2 className="text-2xl font-bold mb-6 text-center text-black">CATEGORIES</h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {categoryImages.map((img, index) => (
        <motion.div
          key={`${img.alt}-${index}`}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: originMap[index % 4] }}
          className="flex flex-col cursor-pointer"
        >
          <div className="bg-white shadow-md border border-black p-4 flex justify-center items-center">
            <img
              src={img.src}
              alt={img.alt}
              className="w-56 h-40 object-cover"
            />
          </div>
          <span className="mt-2 text-base text-gray-800 text-left">{img.alt}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Categories;

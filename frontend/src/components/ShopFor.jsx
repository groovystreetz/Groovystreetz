import React from "react";
import { motion } from "framer-motion";

// Replace with actual image paths
import tshirtImg from "../assets/men.jpg";
import menImg from "../assets/men.jpg";
import kidsImg from "../assets/men.jpg";

const categories = [
  { id: 1, name: "Women", image: tshirtImg },
  { id: 2, name: "Men", image: menImg },
  { id: 3, name: "Kids", image: kidsImg },
];

// Variants for container and each card
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: -50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
    },
  },
};

function ShopFor() {
  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-10 text-center text-black">Shop For</h2>
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {categories.map((category) => (
          <Card3D key={category.id} category={category} />
        ))}
      </motion.div>
    </div>
  );
}

function Card3D({ category }) {
  return (
    <motion.div
      className="relative bg-white border border-black cursor-pointer shadow-lg overflow-hidden"
      whileHover={{ scale: 1.03 }}
      variants={cardVariants}
      style={{ height: "300px" }}
    >
      <div className="w-full h-full relative">
        <img
          src={category.image}
          alt={category.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Top-to-bottom Shine effect */}
        <motion.div
          initial={{ y: "-100%" }}
          whileHover={{ y: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          <div className="w-full h-full shine-overlay" />
        </motion.div>
      </div>

      {/* Category Name */}
      <h3 className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 text-black text-lg font-semibold">
        {category.name}
      </h3>
    </motion.div>
  );
}

export default ShopFor;

import React from "react";
import { motion as Motion } from "framer-motion";

const products = [
  { id: 1, name: "Spotlight 1", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNDkLjf19j08ppcvTiDElR3W8NP1ahDZWXpA&s", price: "₹1,299" },
  { id: 2, name: "Spotlight 2", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNDkLjf19j08ppcvTiDElR3W8NP1ahDZWXpA&s", price: "₹1,099" },
  { id: 3, name: "Spotlight 3", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNDkLjf19j08ppcvTiDElR3W8NP1ahDZWXpA&s", price: "₹899" },
];

// Animation settings
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay,
      type: "spring",
      stiffness: 90,
      damping: 15,
    },
  }),
};

const SpotlightProducts = () => {
  return (
    <div className="w-screen mx-auto py-16 px-4">
      <Motion.h2
        className="text-3xl font-extrabold mb-10 text-center text-black"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Spotlight Products
      </Motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <Motion.div
            key={product.id}
            className="relative aspect-square w-full overflow-hidden cursor-pointer group rounded-lg shadow-lg"
            custom={index * 0.2}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {/* Product Image */}
            <Motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Always visible on mobile */}
            <div className="absolute inset-x-0 bottom-0 from-black/70 via-black/40 text-white p-3 flex flex-col items-center md:hidden">
              <h3 className="text-base font-semibold">{product.name}</h3>
              <p className="text-sm">{product.price}</p>
            </div>

            {/* Visible only on hover (desktop) */}
            <Motion.div
              initial={{ opacity: 0, y: 50 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex-col justify-end items-center text-white p-4 opacity-0 group-hover:opacity-100"
            >
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm mt-1">{product.price}</p>
            </Motion.div>
          </Motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpotlightProducts;

import React from "react";
import { motion as Motion } from "framer-motion";

const products = [
  { id: 1, name: "Spotlight 1", image: "/images/spotlight1.jpg", price: "₹1,299" },
  { id: 2, name: "Spotlight 2", image: "/images/spotlight2.jpg", price: "₹1,099" },
  { id: 3, name: "Spotlight 3", image: "/images/spotlight3.jpg", price: "₹899" },
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
      stiffness: 80,
      damping: 12,
    },
  }),
};

const SpotlightProducts = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-4">
      <Motion.h2
        className="text-3xl font-extrabold mb-10 text-center text-black"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        🌟 Spotlight Products
      </Motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {products.map((product, index) => (
          <Motion.div
            key={product.id}
            className="bg-white border border-black shadow-lg flex flex-col items-center p-6"
            custom={index * 0.5} // Delay: 0s, 0.5s, 1s
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            <Motion.img
              src={product.image}
              alt={product.name}
              className="w-36 h-48 object-cover mb-5 shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-orange-500 text-lg font-bold tracking-wide">{product.price}</p>
          </Motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpotlightProducts;

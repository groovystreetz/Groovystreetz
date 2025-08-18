import React from "react";
import { motion as Motion } from "framer-motion";

const products = [
  { id: 1, name: "Groovy 1", image: "/images/groovy1.jpg", price: "₹999" },
  { id: 2, name: "Groovy 2", image: "/images/groovy2.jpg", price: "₹899" },
  { id: 3, name: "Groovy 3", image: "/images/groovy3.jpg", price: "₹799" },
  { id: 4, name: "Groovy 4", image: "/images/groovy4.jpg", price: "₹699" },
];

const ShopByGroovy = () => (
  <div className="w-full max-w-6xl mx-auto py-12">
    <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 tracking-tight">
      Shop by Groovy
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Motion.div
          key={product.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
        >
          <div className="overflow-hidden rounded-t-2xl">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="p-4 flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text mb-4">
              {product.price}
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition">
              Shop Now
            </button>
          </div>
        </Motion.div>
      ))}
    </div>
  </div>
);

export default ShopByGroovy;

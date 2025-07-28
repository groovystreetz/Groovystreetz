import React from "react";

const products = [
  { id: 1, name: "Spotlight 1", image: "/images/spotlight1.jpg", price: "₹1,299" },
  { id: 2, name: "Spotlight 2", image: "/images/spotlight2.jpg", price: "₹1,099" },
  { id: 3, name: "Spotlight 3", image: "/images/spotlight3.jpg", price: "₹899" },
];

const SpotlightProducts = () => (
  <div className="w-full max-w-6xl mx-auto py-8">
    <h2 className="text-2xl font-bold mb-6 text-center text-black">Spotlight Products</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="bg-white  border border-black flex flex-col items-center p-4 transform transition-transform duration-500 hover:scale-105">
          <img
            src={product.image}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-lg mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-orange-400 font-bold">{product.price}</p>
        </div>
      ))}
    </div>
  </div>
);

export default SpotlightProducts;
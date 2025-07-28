import React from "react";

const products = [
  { id: 1, name: "Banners 1", image: "/images/Banners1.jpg" },
  { id: 2, name: "Banners 2", image: "/images/Banners2.jpg" },
  { id: 3, name: "Banners 3", image: "/images/Banners3.jpg" },
];

const Banners = () => (
  <div className="w-full max-w-6xl mx-auto py-8">
    <h2 className="text-2xl font-bold mb-6 text-center text-black">Banners </h2>
    <div className="flex gap-8 items-center">
      {products.map((product, idx) => (
        <div
          key={product.id}
          className={
            idx === 1
              ? "flex-1 bg-white  shadow-md border border-black flex flex-col items-center p-4 transform transition-transform duration-500 hover:scale-105"
              : "w-40 bg-white  shadow-md border border-black flex flex-col items-center p-4 transform transition-transform duration-500 hover:scale-105"
          }
        >
          <img
            src={product.image}
            alt={product.name}
            className={
              idx === 1
                ? "w-full h-32 object-cover  mb-4"
                : "w-full h-32 object-cover  mb-4"
            }
          />
        </div>
      ))}
    </div>
  </div>
);

export default Banners;
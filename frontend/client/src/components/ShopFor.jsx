import React from "react";

const categories = [
  { id: 1, name: "Women", image: "/images/women.jpg" },
  { id: 2, name: "Men", image: "/images/men.jpg" },
  { id: 3, name: "Kids", image: "/images/kids.jpg" },
];

function ShopFor() {
  return (
    <div className="w-full max-w-6xl mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Shop For</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-black flex flex-col items-center p-4 transform transition-transform duration-500 hover:scale-105"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-32 h-32 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold text-black">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopFor;

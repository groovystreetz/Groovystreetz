import React from "react";

const products = [
  { id: 1, name: "Groovy 1", image: "/images/groovy1.jpg", price: "₹999" },
  { id: 2, name: "Groovy 2", image: "/images/groovy2.jpg", price: "₹899" },
  { id: 3, name: "Groovy 3", image: "/images/groovy3.jpg", price: "₹799" },
  { id: 4, name: "Groovy 4", image: "/images/groovy4.jpg", price: "₹699" },
];

const ShopByGroovy = () => (
  <div className="w-full max-w-6xl mx-auto py-8">
    <h2 className="text-2xl font-bold mb-6 text-center text-black">Shop by Groovy</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative w-full h-64 [perspective:1000px]"
        >
          <div className="w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
            {/* Front Side */}
            <div className="absolute w-full h-full bg-white shadow-md border border-black flex flex-col items-center p-4 [backface-visibility:hidden]">
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-black mb-2">
                {product.name}
              </h3>
              <p className="text-orange-400 font-bold">{product.price}</p>
            </div>

            {/* Back Side */}
            <div className="absolute w-full h-full bg-orange-100 shadow-md border border-black flex flex-col items-center justify-center p-4 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-md">
              <p className="text-gray-700 text-sm mb-2 text-center">
                Discover more about <strong>{product.name}</strong>
              </p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ShopByGroovy;

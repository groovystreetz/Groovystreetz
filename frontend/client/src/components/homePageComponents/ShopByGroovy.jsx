import React from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

const ShopByGroovy = () => {
  const navigate = useNavigate();
  const { products, isLoading, isError } = useProducts();
  const displayProducts = products.slice(0, 4);

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load products.</div>;

  return (
    <div className="w-full max-w-[95%] mx-auto py-6 sm:py-12 px-4 sm:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center text-gray-900 tracking-tight">
        Shop by Groovy
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product, index) => (
          <Motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-none shadow-lg hover:shadow-2xl transition overflow-hidden cursor-pointer w-full"
            onClick={() => handleCardClick(product.id)}
          >
            <div className="overflow-hidden rounded-t-none">
              <Motion.img
                src={product.image || "/images/groovy1.jpg"}
                alt={product.name}
                className="w-full h-48 sm:h-56 object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="p-3 sm:p-4 flex flex-col items-center text-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text mb-3 sm:mb-4">
                ₹{product.price}
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition w-full sm:w-auto">
                Shop Now
              </button>
            </div>
          </Motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShopByGroovy;

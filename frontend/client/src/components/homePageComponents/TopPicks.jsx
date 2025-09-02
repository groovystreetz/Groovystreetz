import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useProducts } from "../../hooks/useProducts";

const TopPicks = () => {
  const { products, isLoading, isError } = useProducts();
  const [startIdx, setStartIdx] = useState(0);
  const [cardCount, setCardCount] = useState(4);

  useEffect(() => {
    const updateCardCount = () => {
      setCardCount(window.innerWidth < 768 ? 1 : 4);
      setStartIdx(0);
    };
    updateCardCount();
    window.addEventListener("resize", updateCardCount);
    return () => window.removeEventListener("resize", updateCardCount);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load products.</div>;

  // Only use the first 4 products for the carousel
  const displayProducts = products.slice(0, 4);

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(prev - cardCount, 0));
  };

  const handleNext = () => {
    setStartIdx((prev) =>
      Math.min(prev + cardCount, displayProducts.length - 1)
    );
  };

  const visibleProducts = displayProducts.slice(
    startIdx,
    Math.min(startIdx + cardCount, displayProducts.length)
  );

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        TOP PICKS OF THE WEEK
      </h2>
      <div className="relative flex items-center overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={startIdx === 0}
          className={`absolute left-10 z-10 p-2 hover:text-orange-600 bg-white rounded-full shadow-md transition ${
            startIdx === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiChevronLeft className="text-2xl" />
        </button>

        {/* Cards */}
        <div className="flex gap-11 mx-10 w-full justify-center transition-transform duration-500 ease-out">
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className="relative flex flex-col items-start overflow-visible min-w-[250px]"
            >
              {/* Number behind */}
              <span
                className="absolute -left-8 top-32 text-7xl font-extrabold text-white select-none pointer-events-none"
                style={{
                  zIndex: -1,
                  textShadow: "0px 0px 8px rgba(0,0,0,0.6)",
                }}
              >
                {startIdx + index + 1}
              </span>

              {/* Premium Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                <img
                  src={product.image || "/images/product1.jpg"}
                  alt={product.name}
                  className="w-56 h-64 object-cover rounded-2xl"
                />
              </div>

              {/* Text */}
              <div className="mt-3 w-full text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <span className="text-sm text-gray-500 font-medium">
                  {product.category}
                </span>
                <span className="text-gray-800 font-bold block">
                  ₹{product.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={startIdx >= displayProducts.length - 1}
          className={`absolute right-10 z-10 p-2 hover:text-orange-600 bg-white rounded-full shadow-md transition ${
            startIdx >= displayProducts.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <FiChevronRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default TopPicks;

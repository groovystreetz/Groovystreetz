import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useProducts } from "../../hooks/useProducts";

const TopPicks = () => {
  const { getProducts, loading, error } = useProducts();
  const [products, setProducts] = useState([]);
  const [startIdx, setStartIdx] = useState(0);
  const [cardCount, setCardCount] = useState(5);

  useEffect(() => {
    const updateCardCount = () => {
      if (window.innerWidth < 640) {
        setCardCount(1); // Mobile: 1 card
      } else if (window.innerWidth < 768) {
        setCardCount(2); // Small tablet: 2 cards
      } else if (window.innerWidth < 1024) {
        setCardCount(3); // Tablet: 3 cards
      } else {
        setCardCount(5); // Desktop: 5 cards
      }
      setStartIdx(0);
    };
    updateCardCount();
    window.addEventListener("resize", updateCardCount);
    return () => window.removeEventListener("resize", updateCardCount);
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getProducts({ limit: 10 });
        const list = Array.isArray(data)
          ? data
          : data?.results || data?.products || [];
        if (isMounted) setProducts(Array.isArray(list) ? list : []);
      } catch (_) {
        if (isMounted) setProducts([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [getProducts]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load products.</div>;

  // Only use the first 4 products for the carousel
  const displayProducts = (products || []).slice(0, 10);

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
    <div className="w-full max-w-[95%] mx-auto py-4 sm:py-8 px-4 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-black">
        TOP PICKS OF THE WEEKSs
      </h2>
      <div className="relative flex items-center overflow-hidden">
        {/* Left Arrow - Hidden on mobile */}
        <button
          onClick={handlePrev}
          disabled={startIdx === 0}
          className={`hidden sm:block absolute left-2 sm:left-10 z-10 p-2 hover:text-orange-600 bg-white rounded-full shadow-md transition ${
            startIdx === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiChevronLeft className="text-xl sm:text-2xl" />
        </button>

        {/* Cards */}
        <div className="flex gap-2 sm:gap-5 w-full justify-center sm:justify-between transition-transform duration-500 ease-out">
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className="relative flex flex-col items-center sm:items-start overflow-visible w-full sm:w-auto"
            >
              {/* Number behind - Hidden on mobile */}
              <span
                className="hidden sm:block absolute bg-black -left-8 top-32 text-7xl font-extrabold text-white select-none pointer-events-none"
                style={{
                  zIndex: -1,
                  textShadow: "0px 0px 8px rgba(0,0,0,0.6)",
                }}
              >
                {startIdx + index + 1}
              </span>

              {/* Premium Card */}
              <div className="bg-white rounded-none shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl w-full sm:w-auto">
                <img
                  src={product.image || "/images/product1.jpg"}
                  alt={product.name}
                  className="w-full sm:w-56 h-48 sm:h-64 object-cover rounded-none"
                />
              </div>

              {/* Text */}
              <div className="mt-3 w-full text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  {product.category}
                </span>
                <span className="text-gray-800 font-bold block text-sm sm:text-base">
                  ₹{product.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow - Hidden on mobile */}
        <button
          onClick={handleNext}
          disabled={startIdx >= displayProducts.length - 1}
          className={`hidden sm:block absolute right-2 sm:right-10 z-10 p-2 hover:text-orange-600 bg-white rounded-full shadow-md transition ${
            startIdx >= displayProducts.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <FiChevronRight className="text-xl sm:text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default TopPicks;

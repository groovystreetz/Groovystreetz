import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const products = [
  {
    id: 1,
    name: "Product 1",
    category: "Shirts",
    image: "/images/product1.jpg",
    price: "₹999",
  },
  {
    id: 2,
    name: "Product 2",
    category: "Boxers",
    image: "/images/product2.jpg",
    price: "₹899",
  },
  {
    id: 3,
    name: "Product 3",
    category: "Shirts",
    image: "/images/product3.jpg",
    price: "₹799",
  },
  {
    id: 4,
    name: "Product 4",
    category: "Boxers",
    image: "/images/product4.jpg",
    price: "₹699",
  },
  {
    id: 5,
    name: "Product 5",
    category: "Shirts",
    image: "/images/product5.jpg",
    price: "₹599",
  },
  {
    id: 6,
    name: "Product 6",
    category: "Boxers",
    image: "/images/product6.jpg",
    price: "₹499",
  },
  {
    id: 7,
    name: "Product 7",
    category: "Shirts",
    image: "/images/product7.jpg",
    price: "₹399",
  },
  {
    id: 8,
    name: "Product 8",
    category: "Boxers",
    image: "/images/product8.jpg",
    price: "₹299",
  },
  {
    id: 9,
    name: "Product 9",
    category: "Shirts",
    image: "/images/product9.jpg",
    price: "₹199",
  },
  {
    id: 10,
    name: "Product 10",
    category: "Boxers",
    image: "/images/product10.jpg",
    price: "₹99",
  },
];

const TopPicks = () => {
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

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(prev - cardCount, 0));
  };

  const handleNext = () => {
    setStartIdx((prev) =>
      Math.min(prev + cardCount, products.length - cardCount)
    );
  };

  const visibleProducts = products.slice(startIdx, startIdx + cardCount);

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        TOP 10 PICKS OF THE WEEK
      </h2>
      <div className="relative flex items-center overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={startIdx === 0}
          className={`absolute left-10 z-10 p-2 hover:text-orange-600 bg-transparent border-none transition-colors ${
            startIdx === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiChevronLeft className="text-5xl" />
        </button>

        {/* Cards + Text */}
        <div className="flex gap-11 mx-10 w-full justify-center">
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className="relative flex flex-col items-start overflow-visible min-w-[250px]"
            >
              {/* Number partially behind the card */}
              <span
                className="absolute -left-8 top-32 text-7xl font-extrabold text-white select-none pointer-events-none"
                style={{
                  zIndex: -1,
                  textShadow:
                    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                {startIdx + index + 1}
              </span>

              {/* Image Card */}
              <div className="bg-white border border-black shadow-[-5px_5px_5px_rgba(0,0,0,0.5)] overflow-visible transform transition-transform duration-500 hover:scale-105">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-56 h-60 object-cover rounded-lg"
                />
              </div>

              {/* Text outside the card - left aligned */}
              <div className="mt-2 w-full text-left">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <span className="text-sm text-gray-500 font-medium">
                  {product.category}
                </span>
                <span className="text-gray-600 font-bold block">
                  {product.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={startIdx >= products.length - cardCount}
          className={`absolute right-10 z-10 p-2 hover:text-orange-600 bg-transparent border-none transition-colors ${
            startIdx >= products.length - cardCount
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <FiChevronRight className="text-5xl" />
        </button>
      </div>
    </div>
  );
};

export default TopPicks;

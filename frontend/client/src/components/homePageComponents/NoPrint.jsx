import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion as Motion } from "framer-motion";
import { useProducts } from "../../hooks/useProducts";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function NoPrint() {
  const { products, isLoading, isError } = useProducts();
  const [startIndex, setStartIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const cardsPerPage = 3;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load products.</div>;

  // Only use the first 4 products for this section
  const displayProducts = products.slice(0, 4);
  const visibleItems = displayProducts.slice(startIndex, startIndex + cardsPerPage);

  const triggerAnimation = () => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 10);
  };

  const handleNext = () => {
    if (startIndex + cardsPerPage < displayProducts.length) {
      setStartIndex(startIndex + cardsPerPage);
      triggerAnimation();
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - cardsPerPage);
      triggerAnimation();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20 relative">
      <h2 className="text-3xl font-extrabold text-center mb-10 text-gray-900 tracking-wide">
        NO PRINTS
      </h2>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg bg-white/70 backdrop-blur-sm hover:bg-white text-gray-800 hover:text-orange-600 transition ${
          startIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        <FiChevronLeft size={28} />
      </button>

      <button
        onClick={handleNext}
        disabled={startIndex >= displayProducts.length - cardsPerPage}
        className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg bg-white/70 backdrop-blur-sm hover:bg-white text-gray-800 hover:text-orange-600 transition ${
          startIndex >= displayProducts.length - cardsPerPage
            ? "opacity-40 cursor-not-allowed"
            : ""
        }`}
      >
        <FiChevronRight size={28} />
      </button>

      {/* Card Grid */}
      <Motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={animate ? "show" : "hidden"}
        onViewportEnter={() => {
          if (!animate) setAnimate(true);
        }}
        viewport={{ once: false, amount: 0.3 }}
      >
        {visibleItems.map((item) => (
          <Motion.div
            key={item.id}
            className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transform transition duration-500"
            variants={cardVariants}
          >
            <div className="flex h-[320px] relative">
              {/* Vertical Label */}
              <div className="w-12 bg-black flex items-center justify-center text-white text-xs font-bold tracking-wider uppercase">
                <span
                  className="transform rotate-180 whitespace-nowrap"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {item.category || item.name}
                </span>
              </div>

              {/* Image */}
              <img
                src={item.image || "/images/noprint1.jpg"}
                alt={item.name}
                className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
            </div>
          </Motion.div>
        ))}
      </Motion.div>
    </div>
  );
}

export default NoPrint;

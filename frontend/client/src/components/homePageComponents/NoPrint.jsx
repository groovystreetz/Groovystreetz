import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion as Motion } from "framer-motion";

const noPrintItems = [
  { id: 1, image: "/images/noprint1.jpg", label: "OVERSIZED T-SHIRTS" },
  { id: 2, image: "/images/noprint2.jpg", label: "OVERSIZED T-SHIRTS" },
  { id: 3, image: "/images/noprint3.jpg", label: "BOTTOMS" },
  { id: 4, image: "/images/noprint4.jpg", label: "SHIRTS" },
  { id: 5, image: "/images/noprint5.jpg", label: "JEANS" },
  { id: 6, image: "/images/noprint6.jpg", label: "HOODIES" },
  { id: 7, image: "/images/noprint7.jpg", label: "FORMALS" },
  { id: 8, image: "/images/noprint8.jpg", label: "SHORTS" },
  { id: 9, image: "/images/noprint9.jpg", label: "TROUSERS" },
];

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
    scaleY: 0,
    originY: 1,
  },
  show: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function NoPrint() {
  const [startIndex, setStartIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const cardsPerPage = 3;

  const visibleItems = noPrintItems.slice(startIndex, startIndex + cardsPerPage);

  const triggerAnimation = () => {
    setAnimate(false); // reset animation
    setTimeout(() => setAnimate(true), 10); // small delay to restart
  };

  const handleNext = () => {
    if (startIndex + cardsPerPage < noPrintItems.length) {
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
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">NO PRINTS</h2>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className={`absolute left-16 top-[225px] -translate-y-1/2 z-10 p-2 text-4xl bg-transparent hover:text-orange-600 ${
          startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FiChevronLeft />
      </button>

      <button
        onClick={handleNext}
        disabled={startIndex >= noPrintItems.length - cardsPerPage}
        className={`absolute right-12 top-[225px] -translate-y-1/2 z-10 p-2 text-4xl bg-transparent hover:text-orange-600 ${
          startIndex >= noPrintItems.length - cardsPerPage ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FiChevronRight />
      </button>

      {/* Card Grid with animation triggered on arrow click and scroll */}
      <Motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
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
            className="group overflow-hidden border border-black h-[310px] transform transition-transform duration-500 hover:scale-105 origin-bottom"
            variants={cardVariants}
          >
            <div className="flex h-full">
              {/* Left Vertical Label */}
              <div className="w-10 pt-5 bg-black flex items-start justify-center text-white text-md tracking-widest font-bold uppercase">
                <span
                  className="transform rotate-180 whitespace-nowrap"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {item.label}
                </span>
              </div>

              {/* Image */}
              <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
            </div>
          </Motion.div>
        ))}
      </Motion.div>
    </div>
  );
}

export default NoPrint;

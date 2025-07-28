import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const noPrintItems = [
  {
    id: 1,
    image: "/images/noprint1.jpg",
    label: "OVERSIZED T-SHIRTS",
  },
  {
    id: 2,
    image: "/images/noprint2.jpg",
    label: "OVERSIZED T-SHIRTS",
  },
  {
    id: 3,
    image: "/images/noprint3.jpg",
    label: "BOTTOMS",
  },
  {
    id: 4,
    image: "/images/noprint4.jpg",
    label: "SHIRTS",
  },
  {
    id: 5,
    image: "/images/noprint5.jpg",
    label: "JEANS",
  },
  {
    id: 6,
    image: "/images/noprint6.jpg",
    label: "HOODIES",
  },
  {
    id: 7,
    image: "/images/noprint7.jpg",
    label: "FORMALS",
  },
  {
    id: 8,
    image: "/images/noprint8.jpg",
    label: "SHORTS",
  },
  {
    id: 9,
    image: "/images/noprint9.jpg",
    label: "TROUSERS",
  },
];

function NoPrint() {
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 3;

  const handleNext = () => {
    if (startIndex + cardsPerPage < noPrintItems.length) {
      setStartIndex(startIndex + cardsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - cardsPerPage);
    }
  };

  const visibleItems = noPrintItems.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20 relative">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        NO PRINTS
      </h2>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className={`absolute left-10 top-[200px] -translate-y-1/2 z-10 p-2 text-4xl bg-transparent hover:text-orange-600 ${
          startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FiChevronLeft />
      </button>

      <button
        onClick={handleNext}
        disabled={startIndex >= noPrintItems.length - cardsPerPage}
        className={`absolute right-10 top-[200px] -translate-y-1/2 z-10 p-2 text-4xl bg-transparent hover:text-orange-600 ${
          startIndex >= noPrintItems.length - cardsPerPage
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <FiChevronRight />
      </button>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden border border-black h-72 transform transition-transform duration-500 hover:scale-105"
          >
            <div className="flex h-full">
              {/* Left Vertical Label */}
              <div className="w-10 bg-black flex items-start justify-center text-white text-md tracking-widest font-bold uppercase">
                <span
                  className="transform rotate-180 whitespace-nowrap"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {item.label}
                </span>
              </div>

              {/* Image */}
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoPrint;

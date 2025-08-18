import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const imageURL =
  "https://imprez.in/im-storage/2024/05/Supima-Black-T-Shirts-Premium-Comfort-and-Durability.jpg";

const items = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `Supima: Sparkling Orange ${i + 1}`,
  category: "Premium Cotton T-Shirts",
  price: `₹999`,
  oldPrice: `₹1,199`,
  image: imageURL,
}));

function Banners() {
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 5;
  const cardWidth = 208; // card + gap
  const maxIndex = items.length - cardsPerPage;
  const autoScrollInterval = useRef(null);

  const handleNext = () => {
    setStartIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  // Auto scroll setup
  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      setStartIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 3000);

    return () => clearInterval(autoScrollInterval.current);
  }, [maxIndex]);

  const resetAutoScroll = () => {
    clearInterval(autoScrollInterval.current);
    autoScrollInterval.current = setInterval(() => {
      setStartIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 3000);
  };

  const tiltStyles = [
    { rotate: "-12deg", translateX: "-20px", scale: 0.9, zIndex: 1 },
    { rotate: "-6deg", translateX: "-10px", scale: 0.95, zIndex: 2 },
    { rotate: "0deg", translateX: "0px", scale: 1, zIndex: 3 },
    { rotate: "6deg", translateX: "10px", scale: 0.95, zIndex: 2 },
    { rotate: "12deg", translateX: "20px", scale: 0.9, zIndex: 1 },
  ];

  return (
    <div className="mt-20 px-4 md:px-8 relative max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        WATCH AND SHOP
      </h2>

      <div className="relative flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={() => {
            handlePrev();
            resetAutoScroll();
          }}
          disabled={startIndex === 0}
          className={`z-10 p-2 mr-2 hover:text-orange-600 bg-white shadow-lg rounded-full ${
            startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiChevronLeft className="text-3xl" />
        </button>

        {/* Cards Container */}
        <div className="overflow-hidden w-[1040px]">
          <div
            className="flex gap-6 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(${-startIndex * (cardWidth + 24)}px)`,
            }}
          >
            {items.map((item, index) => {
              const visiblePos = index - startIndex;
              const style =
                visiblePos >= 0 && visiblePos < cardsPerPage
                  ? tiltStyles[visiblePos]
                  : { rotate: "0deg", translateX: "0px", scale: 0.85, zIndex: 0 };

              return (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-52 cursor-pointer"
                  style={{
                    transform: `rotate(${style.rotate}) translateX(${style.translateX}) scale(${style.scale})`,
                    zIndex: style.zIndex,
                    transition: "transform 0.7s ease-in-out",
                  }}
                  title={item.title}
                >
                  <div className="relative w-full h-[350px] rounded-2xl shadow-xl overflow-hidden bg-white">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay Text */}
                    <div className="absolute inset-0 flex items-center justify-center px-2 text-center">
                      <p className="text-white font-bold text-sm sm:text-base leading-tight drop-shadow-lg">
                        COLOURS THAT
                        <br />
                        DON’T FADE
                      </p>
                    </div>
                    {/* Product info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 text-xs text-black px-2 py-2 flex items-center gap-2 shadow-md">
                      <img
                        src={item.image}
                        alt="Product"
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-semibold truncate">{item.title}</span>
                        <span className="text-xs text-gray-600">
                          {item.price}{" "}
                          <span className="line-through text-gray-400">
                            {item.oldPrice}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-left">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                    <p className="text-sm text-gray-700 font-bold">{item.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => {
            handleNext();
            resetAutoScroll();
          }}
          disabled={startIndex >= maxIndex}
          className={`z-10 p-2 ml-2 hover:text-orange-600 bg-white shadow-lg rounded-full ${
            startIndex >= maxIndex ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiChevronRight className="text-3xl" />
        </button>
      </div>
    </div>
  );
}

export default Banners;

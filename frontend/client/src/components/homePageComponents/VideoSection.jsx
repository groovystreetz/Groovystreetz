import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const videoItems = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `Supima: Sparkling Orange ${i + 1}`,
  category: "Premium Cotton T-Shirts",
  price: `₹999`,
  oldPrice: `₹1,199`,
  video: `/videos/video${(i % 5) + 1}.mp4`,
  thumbnail: `/images/thumb${(i % 5) + 1}.jpg`,
}));

function VideoSection() {
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 5;
  const cardWidth = 208; // approx card width including gap
  const maxIndex = videoItems.length - cardsPerPage;
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
    }, 3000); // every 3 seconds

    return () => clearInterval(autoScrollInterval.current);
  }, [maxIndex]);

  // Reset auto-scroll timer on manual arrow click
  const resetAutoScroll = () => {
    clearInterval(autoScrollInterval.current);
    autoScrollInterval.current = setInterval(() => {
      setStartIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 3000);
  };

  const tiltStyles = [
    { rotate: "-20deg", translateX: "-20px", scale: 0.9, zIndex: 1 },
    { rotate: "-10deg", translateX: "-10px", scale: 0.95, zIndex: 2 },
    { rotate: "0deg", translateX: "0px", scale: 1, zIndex: 3 },
    { rotate: "10deg", translateX: "10px", scale: 0.95, zIndex: 2 },
    { rotate: "20deg", translateX: "20px", scale: 0.9, zIndex: 1 },
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
          className={`z-10 p-2 mr-2 hover:text-orange-600 bg-transparent ${
            startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiChevronLeft className="text-3xl" />
        </button>

        {/* Visible window */}
        <div className="overflow-hidden w-[1040px]">
          <div
            className="flex gap-6 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(${-startIndex * (cardWidth + 24)}px)`,
            }}
          >
            {videoItems.map((item, index) => {
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
                  <div className="relative w-full h-[350px] border border-black overflow-hidden bg-gray-300">
                    <video
                      src={item.video}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center px-2 text-center">
                      <p className="text-black font-semibold text-sm sm:text-base leading-tight drop-shadow">
                        COLOURS THAT
                        <br />
                        DON’T FADE
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 text-xs text-black px-2 py-1 flex items-center gap-2">
                      <img
                        src={item.thumbnail}
                        alt="Product"
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold truncate">{item.title}</span>
                        <span className="text-xs text-gray-600">
                          {item.price}{" "}
                          <span className="line-through text-gray-400">{item.oldPrice}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-left">
                    <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
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
          className={`z-10 p-2 ml-2 hover:text-orange-600 bg-transparent ${
            startIndex >= maxIndex ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiChevronRight className="text-3xl" />
        </button>
      </div>
    </div>
  );
}

export default VideoSection;

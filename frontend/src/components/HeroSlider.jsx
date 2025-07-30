import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const banners = [
  { id: 1, image: "/images/banner1.jpg", alt: "Banner 1" },
  { id: 2, image: "/images/banner2.jpg", alt: "Banner 2" },
  { id: 3, image: "/images/banner3.jpg", alt: "Banner 3" },
  { id: 4, image: "/images/banner4.jpg", alt: "Banner 4" },
  { id: 5, image: "/images/banner5.jpg", alt: "Banner 5" },
  { id: 6, image: "/images/banner6.jpg", alt: "Banner 6" },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const length = banners.length;
  const timeoutRef = useRef(null);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prevIndex) => (prevIndex === length - 1 ? 0 : prevIndex + 1));
    }, 4000);

    return () => resetTimeout();
  }, [current]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  return (
    <div className="relative w-full mt-[66px] border border-black overflow-hidden shadow-lg">
      {/* Slider wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map(({ id, image, alt }) => (
          <div key={id} className="min-w-full select-none">
            <img
              src={image}
              alt={alt}
              className="  h-72 md:h-96 object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-600 bg-transparent bg-opacity-40 p-2 hover:text-orange-500 transition"
        aria-label="Previous Slide"
      >
        <FiChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 bg-transparent bg-opacity-40 p-2 hover:text-orange-500 transition"
        aria-label="Next Slide"
      >
        <FiChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === current ? "bg-orange-500" : "bg-gray-300 bg-opacity-50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


export default HeroSlider;

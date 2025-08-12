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

const DURATION = 2500; // 2.5 seconds

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const length = banners.length;

  const timeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Progress state (0 to 100)
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);

  // Slide auto change effect
  useEffect(() => {
    resetTimeout();
    setProgress(0);
    startTimeRef.current = performance.now();

    // Animate progress ring smoothly
    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const newProgress = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(newProgress);

      if (elapsed < DURATION) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    // Set timeout for slide change
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, DURATION);

    return () => {
      resetTimeout();
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [current, length]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Navigation handlers
  const handleDotClick = (index) => {
    setCurrent(index);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  // Circle params
  const radius = 9;
  const circumference = 2 * Math.PI * radius;

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
              className="h-[350px] md:h-[500px] object-cover"
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, idx) => {
          const isActive = idx === current;
          const dashOffset = isActive
            ? ((100 - progress) / 100) * circumference
            : circumference;

          return (
            <div
              key={idx}
              onClick={() => handleDotClick(idx)}
              className="relative w-6 h-6 cursor-pointer"
              aria-label={`Go to slide ${idx + 1}`}
            >
              {/* Base circle border */}
              <div
                className={`w-full h-full rounded-full border-2 ${
                  isActive ? "border-none" : "border-gray-300"
                }`}
              />

              {/* Filled inner circle */}
              {isActive && (
                <div className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full bg-orange-500 pointer-events-none" />
              )}

              {/* Animated progress ring */}
              {isActive && (
                <svg
                  className="absolute top-0 left-0 w-full h-full rotate-[-90deg] pointer-events-none"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    fill="transparent"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HeroSlider;

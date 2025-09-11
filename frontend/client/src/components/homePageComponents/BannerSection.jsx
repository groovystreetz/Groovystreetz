import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  { id: 1, name: "Banner 1", image: "https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Homepage_banner_-_Harry_Potter_-_The_Silent_Vow_copy_2.jpg" },
  { id: 2, name: "Banner 2", image: "https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/homepage_7vVfBCV.jpg" },
  { id: 3, name: "Banner 3", image: "https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/plaid_homepage.jpg" },
];

const Banners = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? products.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev === products.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Banner text overlay */}
            {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/50 text-white px-6 py-3 rounded-2xl shadow-lg">
              <p className="text-lg font-semibold">{product.name}</p>
            </div> */}
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/70 transition"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/70 transition"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              idx === activeIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banners;

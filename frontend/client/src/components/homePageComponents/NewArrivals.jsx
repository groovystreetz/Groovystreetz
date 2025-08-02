import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import men from "../../assets/men.jpg"; //
import menhover from "../../assets/menhover.jpg";

const newArrivals = [
  {
    id: 1,
    title: "Sketchy Panda",
    category: "Oversized T-Shirts",
    price: "₹999",
    image: men,
    hoverImage: menhover,
    labels: [],
  },
  {
    id: 2,
    title: "Disney: Need Caffeine",
    category: "Oversized T-Shirts",
    price: "₹999",
    image: "/images/arrivals2.jpg",
    hoverImage: "/images/arrivals2-hover.jpg",
    labels: ["PREMIUM"],
  },
  {
    id: 3,
    title: "Fumes NX: Storm",
    category: "Men's Low Top Sneakers",
    price: "₹2999",
    image: "/images/arrivals3.jpg",
    hoverImage: "/images/arrivals3-hover.jpg",
    labels: [],
  },
    {
    id: 4,
    title: "Polo Sweater: Pulse",
    category: "Oversized Pullovers",
    price: "₹1999",
    image: "/images/arrivals4.jpg",
    hoverImage: "/images/arrivals4-hover.jpg",
    labels: ["OVERSIZED FIT"],
  },
  {
    id: 5,
    title: "Vintage Crew",
    category: "Hoodies",
    price: "₹1799",
    image: "/images/arrivals5.jpg",
    hoverImage: "/images/arrivals5-hover.jpg",
    labels: [],
  },
  {
    id: 6,
    title: "Urban Camo",
    category: "Track Pants",
    price: "₹1299",
    image: "/images/arrivals6.jpg",
    hoverImage: "/images/arrivals6-hover.jpg",
    labels: [],
  },
  {
    id: 7,
    title: "Essentials Tee",
    category: "Oversized T-Shirts",
    price: "₹899",
    image: "/images/arrivals7.jpg",
    hoverImage: "/images/arrivals7-hover.jpg",
    labels: [],
  },
  {
    id: 8,
    title: "Streetwear Skull",
    category: "Graphic T-Shirts",
    price: "₹1099",
    image: "/images/arrivals8.jpg",
    hoverImage: "/images/arrivals8-hover.jpg",
    labels: [],
  },
  {
    id: 9,
    title: "Denim Fit",
    category: "Jeans",
    price: "₹1499",
    image: "/images/arrivals9.jpg",
    hoverImage: "/images/arrivals9-hover.jpg",
    labels: [],
  },
  {
    id: 10,
    title: "Winter Warmer",
    category: "Sweaters",
    price: "₹2299",
    image: "/images/arrivals10.jpg",
    hoverImage: "/images/arrivals10-hover.jpg",
    labels: [],
  },
  {
    id: 11,
    title: "Contrast Collar",
    category: "Polo Shirts",
    price: "₹1399",
    image: "/images/arrivals11.jpg",
    hoverImage: "/images/arrivals11-hover.jpg",
    labels: [],
  },
  {
    id: 12,
    title: "Casual Canvas",
    category: "Sneakers",
    price: "₹1999",
    image: "/images/arrivals12.jpg",
    hoverImage: "/images/arrivals12-hover.jpg",
    labels: [],
  },
];

function NewArrivals() {
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 4;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - cardsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + cardsPerPage, newArrivals.length - cardsPerPage)
    );
  };

  const visibleArrivals = newArrivals.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  return (
    <div className="mt-20 bg-white">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          NEW ARRIVALS
        </h2>

        {/* Arrows */}
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className={`absolute left-10 top-1/2 -translate-y-1/2 z-10 p-2 hover:text-orange-600 bg-transparent border-none transition-colors ${
            startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiChevronLeft className="text-3xl" />
        </button>

        <button
          onClick={handleNext}
          disabled={startIndex >= newArrivals.length - cardsPerPage}
          className={`absolute right-10 top-1/2 -translate-y-1/2 z-10 p-2 hover:text-orange-600 bg-transparent border-none transition-colors ${
            startIndex >= newArrivals.length - cardsPerPage
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <FiChevronRight className="text-3xl" />
        </button>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {visibleArrivals.map((item) => (
            <div key={item.id}>
              <div className="relative w-full h-72 overflow-hidden border border-black group">
                {/* Original Image - fades out in 1s on hover, fades in 1s when unhovered */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-100 group-hover:opacity-0"
                />

                {/* Hover Image - fades in on hover over 1s, zooms in smoothly over 3s */}
                <img
                  src={item.hoverImage || item.image}
                  alt={`${item.title} hover`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-[3000ms] ease-in-out"
                />

                {/* Labels */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  {item.labels.map((label, idx) => (
                    <span
                      key={idx}
                      className="bg-black text-white text-xs px-2 py-0.5 rounded-sm font-semibold"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-left">
                <h3 className="text-sm text-gray-800 font-semibold">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">{item.category}</p>
                <p className="text-sm text-gray-700 font-bold mt-0.5">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewArrivals;

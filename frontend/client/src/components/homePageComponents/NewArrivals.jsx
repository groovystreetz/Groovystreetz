import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import men from "../../assets/men.jpg";
// import menhover from "../../assets/menhover.jpg";

const newArrivals = [
  {
    id: 1,
    title: "Sketchy Panda",
    category: "Oversized T-Shirts",
    price: "₹999",
    image: "https://weezy.in/cdn/shop/files/BE1.jpg?v=1716644946&width=1500",
    hoverImage: "https://weezy.in/cdn/shop/files/BE1.jpg?v=1716644946&width=1500",
    labels: [],
  },
  {
    id: 2,
    title: "Disney: Need Caffeine",
    category: "Oversized T-Shirts",
    price: "₹999",
    image: "https://strongsoul.in/cdn/shop/products/mockup-of-someone-holding-a-t-shirt-on-a-hanger-m19023-r-el2_2_914f4bea-6ce8-40c7-82c7-f67e7774511c.png?v=1678641644&width=1080",
    hoverImage: "https://strongsoul.in/cdn/shop/products/mockup-of-someone-holding-a-t-shirt-on-a-hanger-m19023-r-el2_2_914f4bea-6ce8-40c7-82c7-f67e7774511c.png?v=1678641644&width=1080",
    labels: ["PREMIUM"],
  },
  {
    id: 3,
    title: "Fumes NX: Storm",
    category: "Men's Low Top Sneakers",
    price: "₹2999",
    image: "https://blog.redbubble.com/wp-content/uploads/2017/07/2-1.jpg",
    hoverImage: "https://blog.redbubble.com/wp-content/uploads/2017/07/2-1.jpg",
    labels: [],
  },
  {
    id: 4,
    title: "Polo Sweater: Pulse",
    category: "Oversized Pullovers",
    price: "₹1999",
    image: "https://pronk.in/cdn/shop/files/558_98a1b4ea-8bd5-4386-bf56-659fabdee293.jpg?v=1722322834",
    hoverImage: "https://pronk.in/cdn/shop/files/558_98a1b4ea-8bd5-4386-bf56-659fabdee293.jpg?v=1722322834",
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
      <div className=" mx-auto px-4 relative">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 tracking-wide">
          NEW ARRIVALS
        </h2>

        {/* Arrows */}
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className={`absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <FiChevronLeft className="text-2xl text-gray-800" />
        </button>

        <button
          onClick={handleNext}
          disabled={startIndex >= newArrivals.length - cardsPerPage}
          className={`absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <FiChevronRight className="text-2xl text-gray-800" />
        </button>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {visibleArrivals.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer"
            >
              <div className="relative w-full h-80 overflow-hidden rounded-none shadow-md group-hover:shadow-xl transition duration-300">
                {/* Default Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0"
                />

                {/* Hover Image */}
                <img
                  src={item.hoverImage || item.image}
                  alt={`${item.title} hover`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition duration-700 ease-in-out"
                />

                {/* Labels */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  {item.labels.map((label, idx) => (
                    <span
                      key={idx}
                      className="bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Text */}
              <div className="mt-4 text-left px-1">
                <h3 className="text-base text-gray-900 font-semibold line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-base text-gray-800 font-bold mt-1">
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

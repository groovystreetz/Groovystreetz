import React, { useEffect, useRef, useState } from "react";
import tshirtImg from "../../assets/men.jpg";
import menImg from "../../assets/men.jpg";
import kidsImg from "../../assets/men.jpg";

const categories = [
  { id: 1, name: "Women", image: tshirtImg },
  { id: 2, name: "Men", image: menImg },
  { id: 3, name: "Kids", image: kidsImg },
];

function ShopFor() {
  return (
    <div className="w-full max-w-6xl py-16 mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center text-black">Shop For</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {categories.map((category) => (
          <AnimatedCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

function AnimatedCard({ category }) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative bg-white cursor-pointer shadow-lg overflow-hidden rounded-2xl transform transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } hover:scale-105 hover:shadow-2xl`}
      style={{ height: "380px" }}
    >
      {/* Image */}
      <img
        src={category.image}
        alt={category.name}
        className="absolute top-0 left-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Dark Overlay on Hover */}
      <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

      {/* Category Name */}
      <h3 className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2 text-black text-lg font-semibold rounded-full shadow-md transition-all duration-500">
        {category.name}
      </h3>
    </div>
  );
}

export default ShopFor;

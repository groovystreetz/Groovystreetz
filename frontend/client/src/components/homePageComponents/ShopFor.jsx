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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
        {categories.map((category) => (
          <AnimatedCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

function AnimatedCard({ category }) {
  const ref = useRef();
  // const [isVisible, setIsVisible] = useState(false);
  const [style, setStyle] = useState({
    transform: "scaleY(0)",
    transformOrigin: "top",
    transition: "transform 0.6s ease-out",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // setIsVisible(true);
          setStyle((prev) => ({
            ...prev,
            transform: "scaleY(1)",
          }));
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
      style={style}
      className="relative bg-white border border-black cursor-pointer shadow-lg overflow-hidden"
    >
      <div className="w-full h-full relative" style={{ height: "350px" }}>
        <img
          src={category.image}
          alt={category.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Optional static shine overlay */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="w-full h-full" />
        </div>
      </div>

      {/* Category Name */}
      <h3 className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 text-black text-lg font-semibold">
        {category.name}
      </h3>
    </div>
  );
}

export default ShopFor;

import React from "react";

const categoryImages = [
  { src: "/images/urban-monk.jpg", alt: "OVERSIZED T-SHIRT" },
  { src: "/images/urban-animals.jpg", alt: "ALL BOTTOMS" },
  { src: "/images/rockstar.jpg", alt: "SHIRTS" },
  { src: "/images/kids.jpg", alt: "POLOS" },
  { src: "/images/women.jpg", alt: "SHORTS" },
  { src: "/images/men.jpg", alt: "SNEAKERS" },
  { src: "/images/women.jpg", alt: "BOXERS" },
  { src: "/images/women.jpg", alt: "BACKPACKS" },
];

const Categories = () => (
  <div className="w-full max-w-6xl mx-auto pt-4 pb-8 mt-14">
    <h2 className="text-2xl font-bold mb-6 text-center text-black">CATEGORIES</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {categoryImages.map((img, index) => (
        <div key={`${img.alt}-${index}`} className="flex flex-col transform transition-transform duration-500 hover:scale-105 ">
          <div className="bg-white shadow-md border border-black p-4 flex justify-center items-center">
            <img
              src={img.src}
              alt={img.alt}
              className="w-56 h-40 object-cover"
            />
          </div>
          <span className="mt-2 text-base text-gray-800 text-left">{img.alt}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Categories;

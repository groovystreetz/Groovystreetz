import React from "react";

// Category data with new images and descriptions
const categories = [
  {
    id: 1,
    name: "MEN",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-P9MArCsLFRS4D_jvEXTeYu-ngID7L1aiYYurmApQj_IVigCW4T2JLKgcheI67KmjNiHv4jPqjhfhN2sLrMTvGszEdLQVJQVZ_EHAUr3m4jTiS3a1ZyHaPeL97AC3wUm3BoQD_tNPExtNNb0dKGB9fVZb145O2dBrSNdD-HbEbP15ENTFQ-B2nrAB8PS5ByZTIjMwHS_H4CMTzhpRp1mqGbpQSo2XNxicnYQeKNgZR9gvjONWt8Eh-PuGxghh4RdT6O4W3wC6Zqy-",
    alt: "Man wearing a t-shirt",
    description: "OUR COOLEST T-SHIRTS",
  },
  {
    id: 2,
    name: "WOMEN",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBE1s1gNcZwaASLj_n9RlK6TktY2GCeWO5y4HtSyoejU9RQ32Oe3zV5SBSfW0bPhf1Pf14Q3f4sE7o_VyAJ8Enm6ANhEu_ZLNHz6o1IpIUqzTiLBUr1SDGeI1RIViAyOQdLVqheKfJ4kihRhYMLfheWYcT6dF2q84KhpQciPiiT8Y1im5DpVDLuKUsmGKChSXmkvCCVY5aADTSwGGyJo-WvduUdKhf_D7tFdaOJYjm5oeaHsURs-8lRbSINQJ_SoAbq7nKMz5Re7Y-i",
    alt: "Woman wearing a t-shirt",
    description: "TRENDING STYLES FOR YOU",
  },
  {
    id: 3,
    name: "KIDS",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAF9Rk5MmPLrS0M67tGw0NY4W1MDXpHpEGHyNXNP2MOqNBmn-8pAFd_hb-y_etUqYe0Hw5JYQXKU-KvmkhKn_vh2H3m828NzFO8zNZiZVyaiJcT8WujmPTnQR5q_irBXeBWYx4x5zLM55q8WZ6reH_YWc-bjtMfpbU2C0vZ98t3zCGKAVginj73eMSB1yLsmCvSNgUIFC7BLiKONU3j9oYN5Rv8H8noVzkrB_15vo0ZEVVwLDeExzKmCTA6PrhU_1tpR-DarU74ALjD",
    alt: "Kid wearing a t-shirt",
    description: "FUN & PLAYFUL DESIGNS",
  },
];

function ShopFor() {
  return (
    <div className="w-full max-w-[95%] mx-auto px-4 py-6 sm:py-12">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
        SHOP BY CATEGORY
      </h2>
      <div className="relative">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="relative group w-full sm:w-1/3"
            >
              <img
                alt={cat.alt}
                src={cat.image}
                className="w-full aspect-square rounded-lg shadow-md object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-3 sm:p-4 rounded-lg">
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-wider text-center">{cat.name}</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-center">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Navigation Buttons - Hidden on mobile */}
        <button
          className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-2 shadow-md text-gray-600 hover:bg-gray-100"
          type="button"
          tabIndex={-1}
          aria-label="Previous"
        >
          <span className="material-icons">chevron_left</span>
        </button>
        <button
          className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-2 shadow-md text-gray-600 hover:bg-gray-100"
          type="button"
          tabIndex={-1}
          aria-label="Next"
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export default ShopFor;

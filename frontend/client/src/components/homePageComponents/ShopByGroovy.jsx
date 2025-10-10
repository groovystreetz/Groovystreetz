import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ShopByGroovy = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Man",
      slug: "man",
      image: "https://static.vecteezy.com/system/resources/thumbnails/005/346/410/small_2x/close-up-portrait-of-smiling-handsome-young-caucasian-man-face-looking-at-camera-on-isolated-light-gray-studio-background-photo.jpg",
      subcategories: [
        { label: "🎴 Urban Monk", slug: "urban-monk", image: "/images/subcategories/urban-monk.jpg" },
        { label: "🧱 Urban Streets", slug: "urban-streets", image: "/images/subcategories/urban-streets.jpg" },
        { label: "🐯 Urban Animals", slug: "urban-animals", image: "/images/subcategories/urban-animals.jpg" },
        { label: "🎸 Rockstar", slug: "rockstar", image: "/images/subcategories/rockstar.jpg" },
        { label: "👖 Pants", slug: "pants", image: "/images/subcategories/pants.jpg" },
      ],
    },
    {
      title: "Women",
      slug: "women",
      image: "/images/categories/women.jpg",
      subcategories: [
        { label: "🎴 Urban Monk", slug: "urban-monk", image: "/images/subcategories/urban-monk.jpg" },
        { label: "🧱 Urban Streets", slug: "urban-streets", image: "/images/subcategories/urban-streets.jpg" },
        { label: "🐯 Urban Animals", slug: "urban-animals", image: "/images/subcategories/urban-animals.jpg" },
        { label: "🎸 Rockstar", slug: "rockstar", image: "/images/subcategories/rockstar.jpg" },
        { label: "👖 Pants", slug: "pants", image: "/images/subcategories/pants.jpg" },
      ],
    },
    {
      title: "Groovy Streetz",
      slug: "groovy-street",
      image: "/images/categories/groovy-street.jpg",
    },
    {
      title: "Kidz",
      slug: "kidz",
      image: "/images/categories/kidz.jpg",
    },
  ];

  const [expandedSlug, setExpandedSlug] = useState(null);

  const handleCardClick = (category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setExpandedSlug((prev) => (prev === category.slug ? null : category.slug));
    } else {
      navigate(`/products?categories=${category.slug}`);
    }
  };

  return (
    <div className="w-full max-w-[95%] mx-auto py-6 sm:py-12 px-4 sm:px-0 bg-gradient-to-b from-white to-orange-50">
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-8 h-1 bg-gradient-to-r from-[#F57C26] to-[#d86a1f] rounded-full"></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F57C26] tracking-tight">
            Shop by Groovy
          </h2>
          <div className="w-8 h-1 bg-gradient-to-r from-[#d86a1f] to-[#F57C26] rounded-full"></div>
        </div>
        <p className="text-gray-600 text-sm">Explore our curated collections</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category, index) => (
          <div key={category.slug} className="w-full">
            <Motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-lg shadow-lg hover:shadow-2xl transition overflow-hidden cursor-pointer w-full border-2 border-orange-100 hover:border-[#F57C26]"
              onClick={() => handleCardClick(category)}
            >
              <div className="overflow-hidden rounded-t-lg">
                <Motion.img
                  src={category.image || "/images/groovy1.jpg"}
                  alt={category.title}
                  className="w-full h-56 sm:h-64 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                <h3 className="text-lg sm:text-xl font-semibold drop-shadow group-hover:text-[#F57C26] transition-colors duration-300">{category.title}</h3>
              </div>
            </Motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {expandedSlug && (
          <Motion.div
            key={expandedSlug}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="mt-4 w-full"
          >
            {(() => {
              const selected = categories.find((c) => c.slug === expandedSlug);
              if (!selected || !selected.subcategories) return null;
              return (
                <div className="rounded-lg p-3 sm:p-1 bg-gradient-to-r from-orange-50 to-white border border-orange-100">
                  <div className="flex gap-4 overflow-x-auto justify-between no-scrollbar py-1 "
                  
                  style={
                    // make it scrollable
                    {
                      scrollbarWidth: 'none',
                      '-ms-overflow-style': 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                    }
                  }>
                    {selected.subcategories.map((sub, i) => (
                      <Motion.div
                        key={sub.slug}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.25 }}
                        className="min-w-[220px] sm:min-w-[260px] h-40 sm:h-48 overflow-hidden shadow-lg bg-white cursor-pointer snap-start rounded-lg border-2 border-orange-100 hover:border-[#F57C26] transition-all duration-300"
                        onClick={() => navigate(`/products?categories=${selected.slug}&sub=${sub.slug}`)}
                      >
                        <div className="relative w-full h-full">
                          <img
                            src={sub.image || "/images/groovy1.jpg"}
                            alt={sub.label}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <div className="text-sm sm:text-base font-semibold line-clamp-1 group-hover:text-[#F57C26] transition-colors duration-300">{sub.label}</div>
                          </div>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopByGroovy;

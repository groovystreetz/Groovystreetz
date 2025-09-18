import React, { useEffect, useMemo, useState } from "react";

const products = [
  { id: 1, name: "Banner 1", image: "https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Homepage_banner_-_Harry_Potter_-_The_Silent_Vow_copy_2.jpg" },
  { id: 2, name: "Banner 2", image: "https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/homepage_7vVfBCV.jpg" },
  { id: 3, name: "Banner 3", image: "https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/plaid_homepage.jpg" },
];

const Banners = () => {
  // Build circular slides: [last, ...original, first]
  const circularSlides = useMemo(() => {
    if (products.length === 0) return [];
    const first = products[0];
    const last = products[products.length - 1];
    return [last, ...products, first];
  }, []);

  // Start at index 1 (first real slide)
  const [index, setIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setEnableTransition(true);
      setIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const handleTransitionEnd = () => {
    // If moved past the last real slide (onto the cloned first at end)
    if (index === circularSlides.length - 1) {
      setEnableTransition(false); // disable for instant jump
      setIndex(1); // jump to first real slide
      // Re-enable transition on next tick so future moves animate
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true));
      });
    }
    // If moved before the first real slide (onto the cloned last at start)
    if (index === 0) {
      setEnableTransition(false);
      setIndex(circularSlides.length - 2); // jump to last real slide
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true));
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={`flex h-full ${enableTransition ? "transition-transform duration-700 ease-in-out" : ""}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {circularSlides.map((product, idx) => (
          <div
            key={`${product.id}-${idx}`}
            className="w-full h-full flex-shrink-0 relative"
            style={{ minWidth: "100%" }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banners;

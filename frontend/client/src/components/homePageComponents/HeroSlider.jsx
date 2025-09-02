import React, { useEffect, useRef, useState } from "react";

const banners = [
  {
    id: 1,
    image: "https://images.vexels.com/media/users/3/335953/raw/5c79d20959005bc26ba1cc2d586a584e-landscape-travelling-t-shirt-design.jpg",
    alt: "Groovy Orange Hero",
    headline: "Express Yourself with Groovy Orange",
    subheadline:
      "Discover unique, retro-inspired t-shirts that let your personality shine. Shop our latest collection and find your perfect fit.",
    cta: "Shop Now",
  },
  {
    id: 2,
    image:  "https://images.vexels.com/media/users/3/241040/raw/0d5c7177d13864849f82960d718cc150-yosemite-painting-landscape-t-shirt-design.jpg",
    alt: "Groovy Orange Hero 2",
    headline: "Retro Vibes, Modern Style",
    subheadline:
      "Step into a world of bold colors and groovy designs. Find your new favorite tee today!",
    cta: "Browse Collection",
  },
];

const DURATION = 5000;

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setFade(false);
    const fadeTimeout = setTimeout(() => setFade(true), 100);
    timeoutRef.current = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        setFade(true);
      }, 400);
    }, DURATION);
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(fadeTimeout);
    };
  }, [current]);

  const { image, alt, headline, subheadline, cta } = banners[current];

  return (
    <section
      className="relative  w-screen mt-16 h-screen flex items-center justify-center overflow-hidden font-['Plus Jakarta Sans','Noto Sans',sans-serif]"
    >
      {/* Background Image with overlay */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%), url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
        aria-label={alt}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em] drop-shadow-lg animate-fade-in-up">
          {headline}
        </h1>
        <h2 className="mt-4 text-white text-base md:text-xl font-normal leading-normal drop-shadow-md animate-fade-in-up delay-150">
          {subheadline}
        </h2>
        <button
          className="mt-8 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-[#f48225] text-[#1c140d] text-base font-bold leading-normal tracking-[0.015em] shadow-lg transition-transform duration-300 hover:scale-105 animate-fade-in-up delay-300"
        >
          <span className="truncate">{cta}</span>
        </button>
        {/* Dots */}
        <div className="flex space-x-3 mt-8">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                idx === current ? "bg-[#f48225] border-[#f48225] scale-125" : "border-white bg-transparent"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Navbar overlay (optional, can be moved to layout) */}
      {/*
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-10 py-4 z-20">
        ...
      </header>
      */}
    </section>
  );
}

export default HeroSlider;

// Animations (add to global CSS or Tailwind config)
// .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) both; }
// .delay-150 { animation-delay: 150ms; }
// .delay-300 { animation-delay: 300ms; }
// @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: none; } }

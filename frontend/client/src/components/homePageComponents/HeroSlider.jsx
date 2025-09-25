import React, { useEffect, useRef, useState } from "react";
import { useBanners } from "@/hooks/useBanners";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const DURATION = 5000;

function HeroSlider() {
  const { getHeroBanners, loading } = useBanners();
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const [fade, setFade] = useState(true);

  // Load banners on component mount
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await getHeroBanners();
        setBanners(data);
      } catch (err) {
        console.error('Failed to load banners:', err);
        // Fallback to static banners if API fails
        setBanners([
          {
            id: 1,
            image: "https://images.vexels.com/media/users/3/335953/raw/5c79d20959005bc26ba1cc2d586a584e-landscape-travelling-t-shirt-design.jpg",
            title: "Express Yourself with Groovy Orange",
            subtitle: "Discover unique, retro-inspired t-shirts that let your personality shine. Shop our latest collection and find your perfect fit.",
            link_text: "Shop Now",
            link_url: "/products"
          }
        ]);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    
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
  }, [current, banners.length]);

  if (loading) {
    return (
      <section className="relative w-full max-w-screen overflow-hidden mt-12 sm:mt-16 h-[50vh] sm:h-[70vh] md:h-screen flex items-center justify-center font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mb-4" />
          <p className="text-gray-600 text-lg">Loading banners...</p>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="relative w-full max-w-screen overflow-hidden mt-12 sm:mt-16 h-[50vh] sm:h-[70vh] md:h-screen flex items-center justify-center font-['Plus Jakarta Sans','Noto Sans',sans-serif]">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-gray-600 text-lg">No banners available</p>
        </div>
      </section>
    );
  }

  const currentBanner = banners[current];
  const { image, title, subtitle, link_text, link_url } = currentBanner;

  return (
    <section
      className="relative w-full max-w-screen overflow-hidden mt-12 sm:mt-16 h-[50vh] sm:h-[70vh] md:h-screen flex items-center justify-center font-['Plus Jakarta Sans','Noto Sans',sans-serif]"
    >
      {/* Background */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%), url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
        aria-label={title}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-3 sm:px-6 md:px-8 w-full max-w-3xl">
        <h1 className="text-white text-xl sm:text-3xl md:text-5xl font-extrabold leading-tight tracking-[-0.02em] drop-shadow-lg animate-fade-in-up">
          {title}
        </h1>
        <h2 className="mt-2 sm:mt-4 text-white text-xs sm:text-base md:text-lg font-normal leading-normal drop-shadow-md animate-fade-in-up delay-150 max-w-2xl px-2">
          {subtitle}
        </h2>
        <Link
          to={link_url || '/'}
          className="mt-5 text-white hover:text-white ho sm:mt-7 flex min-w-[84px] max-w-[280px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 sm:h-11 px-4 sm:px-6 bg-[#f48225] text-[#1c140d] text-xs sm:text-sm md:text-base font-bold leading-normal tracking-wide shadow-lg transition-transform duration-300 hover:scale-105 animate-fade-in-up delay-300"
        >
          <span className="truncate text-white">{link_text}</span>
        </Link>
        {/* Dots - only show if more than one banner */}
        {banners.length > 1 && (
          <div className="flex space-x-2 sm:space-x-3 mt-5 sm:mt-7">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 transition-all duration-300 ${
                  idx === current
                    ? "bg-[#f48225] border-[#f48225] scale-110"
                    : "border-white bg-transparent"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSlider;

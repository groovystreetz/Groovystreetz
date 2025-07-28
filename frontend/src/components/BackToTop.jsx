import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300); // Reset after animation
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-orange-500 text-white shadow-lg transition duration-300 hover:bg-orange-600 group"
          aria-label="Back to top"
        >
          <FaArrowUp
            className={`transition-all duration-300 ${
              clicked ? "-translate-y-2" : ""
            } group-hover:text-black`}
          />
        </button>
      )}
    </>
  );
};

export default BackToTop;

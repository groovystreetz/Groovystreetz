import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const DURATION = 2500; // 2.5s

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    let start = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - start;
      const newProgress = Math.min(Math.round((elapsed / DURATION) * 100), 100);
      setProgress(newProgress);
      if (newProgress === 100) clearInterval(interval);
    }, 30);

    controls.start({
      y: "0%",
      transition: { duration: DURATION / 1000, ease: "easeInOut" },
    });

    return () => clearInterval(interval);
  }, [controls]);

  return (
    <div className="fixed inset-0 bg-[#fff] flex items-center justify-center flex-col z-50 overflow-hidden">
      <div className="relative w-full flex justify-center">
        <svg
          viewBox="0 0 800 200"
          className="w-[90vw] h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Mask text */}
          <defs>
            <mask id="text-mask">
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="140"
                fontWeight="800"
                fontFamily="Arial, sans-serif"
                fill="white"
              >
                GROOVY
              </text>
            </mask>
          </defs>

          {/* Static text (white) */}
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="140"
            fontWeight="800"
            fontFamily="Arial, sans-serif"
            fill="#fff"
          >
            GROOVY
          </text>

          {/* Animated wave fill */}
          <motion.g mask="url(#text-mask)">
            {/* Background fill (gray) rising up */}
            <motion.rect
              x="0"
              width="100%"
              height="200"
              initial={{ y: "100%" }}
              animate={controls}
              fill="#d1d5db" // Tailwind gray-300
            />

            {/* First Wave (orange) */}
            <motion.path
              d="M0 130 Q 100 110 200 130 T 400 130 T 600 130 T 800 130 V200 H0 Z"
              fill="#f97316"
              animate={{ x: [0, -100, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Second Wave (orange, offset) */}
            <motion.path
              d="M0 80 Q 100 60 200 80 T 400 80 T 600 80 T 800 80 V200 H0 Z"
              fill="#f97316" // orange
              initial={{ scaleY: 0, originY: 1 }} // Start squished at bottom
              animate={{
                x: [0, -80, 0],
                scaleY: [0, 1, 1], // Grow vertically from 0 to full size, then stay full size
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                delay: 1,
                repeat: Infinity,
              }}
            />
          </motion.g>
        </svg>
      </div>

      {/* Loading text */}
      <p className="text-base  text-black mt-3 font-semibold tracking-widest">
        LOADING... <span className="text-orange-500">{progress} %</span>
      </p>
    </div>
  );
};

export default LoadingPage;

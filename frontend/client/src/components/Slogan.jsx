import React from "react";

function Slogan() {
  return (
    <div className="w-full flex justify-center items-center py-12 bg-white relative overflow-hidden">
      <h1
        className="text-4xl md:text-6xl font-extrabold text-center
          bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600
          text-transparent bg-clip-text
          bg-[length:200%_200%] animate-gradient-move
          transition-transform duration-500 hover:scale-110 stroke-text"
      >
        LIVE BOLD, LIVE{" "}
        <span className="calligraphy-font shining-text">GROOVY</span>
      </h1>

      {/* Custom styles for animation, stroke, calligraphy font, and shining */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

.calligraphy-font {
  font-family: 'Pacifico', cursive;
  font-weight: normal;
  background: none;
  -webkit-text-stroke: 0;
  text-stroke: 0;
  color: #ff5722; /* warm orange */
  position: relative;
  display: inline-block;
  overflow: visible; /* Changed from hidden */
}


        /* Shining effect */
        .shining-text::before {
          content: '';
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: shine 2.5s infinite;
          pointer-events: none;
          z-index: 2;
        }

        @keyframes shine {
          0% {
            left: -75%;
          }
          100% {
            left: 125%;
          }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-move {
          animation: gradientMove 2s ease infinite;
        }

        .stroke-text {
          -webkit-text-stroke: 2px black;
          text-stroke: 2px black;
        }
      `}</style>
    </div>
  );
}

export default Slogan;

import React from "react";

function Slogan() {
  return (
    <div className="w-full flex justify-center items-center py-16 bg-white relative overflow-hidden">
      <h1
        className="text-3xl md:text-6xl font-extrabold text-center
          text-black tracking-tight
          transition-transform duration-500 hover:scale-110"
      >
        LIVE BOLD, LIVE{" "}
        <span className="calligraphy-font shining-text">GROOVY</span>
      </h1>

      {/* Custom styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

        .calligraphy-font {
          font-family: 'Pacifico', cursive;
          font-weight: normal;
          position: relative;
          color: #ff5722; /* main orange */
          -webkit-text-stroke: 1px black; /* outline for contrast */
          text-stroke: 1px black;
          display: inline-block;
        }

        /* Orange shine effect */
        .shining-text::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 70%;
          height: 100%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 165, 0, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: shine 3s infinite;
          pointer-events: none;
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 120%; }
        }
      `}</style>
    </div>
  );
}

export default Slogan;

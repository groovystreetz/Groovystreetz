import React from "react";

function Slogan() {
  return (
    <div className="w-full flex justify-center items-center py-16 bg-white relative overflow-hidden">
      <h1
        className="text-4xl md:text-6xl font-extrabold text-center 
          bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 
          text-transparent bg-clip-text 
          bg-[length:200%_200%] animate-gradient-move 
          transition-transform duration-500 hover:scale-110 stroke-text"
      >
        LIVE BOLD, LIVE GROOVY
      </h1>

      {/* Custom styles for animation and text stroke */}
      <style>{`
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
          text-stroke: 2px black; /* For future support */
        }
      `}</style>
    </div>
  );
}

export default Slogan;

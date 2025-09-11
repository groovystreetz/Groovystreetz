import React from "react";
import { Button } from "../ui/button";

const ProductCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm">
      {/* Image Section */}
      <div className="relative">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjWswCpiEFAzunCgCBvvGM9lbIgnP_NvXZA7GaqWwRymCYtP2DRl-nvtUj_n1ICS2rgcQnwhjw84eByA7bPcvLhNJOY78OeSm4nna7UQ7dBJ3Te5HhtoCZnCHJChdt7hUQuumsw6DnrvamxjPx-f7Yog8rpomMarMp2TxWbMZpT07qmSH4WB6CYr9a00ft8XJ6eVvaPth371-i-jA-07aDPjOuU26BsbrGcP64reJ7Dd_VzhMchJVCCPD8HpTkpjPvCneZZJlOrnE"
          alt="Man wearing a navy blue oversized t-shirt with a detailed trident graphic."
          className="w-full h-auto"
        />

        {/* Top Left Badge */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          <p>OVERSIZED</p>
          <p>FIT</p>
        </div>

        {/* Bottom Left Badge */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          <p>PREMIUM HEAVY</p>
          <p>GAUGE FABRIC</p>
        </div>

        {/* Favorite Button */}
        {/*
          Toggle heart icon between outlined and filled on click.
        */}
        {(() => {
          const [liked, setLiked] = React.useState(false);
          return (
            <Button
              className="absolute bg-transparent top-4 right-4 text-red-500 shadow-none hover:bg-transparent hover:border-none focus:ring-0 outline-none ring-0 focus:outline-none focus-visible:outline-none border-none focus-visible:ring-0 active:ring-0"
              onClick={(e) => {
                e.stopPropagation();
                setLiked((prev) => !prev);
              }}
            >
              <span className="material-icons">
                {liked ? "favorite" : "favorite_border"}
              </span>
            </Button>
          );
        })()}
      </div>

      {/* Details Section */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">TSS Originals: Trident</h3>
        <p className="text-gray-600 mt-1">Oversized T-Shirts</p>
        <p className="text-lg font-semibold text-gray-900 mt-2">₹ 1499</p>
      </div>
    </div>
  );
};

export default ProductCard;

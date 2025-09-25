import React, { useState } from "react";

// ✅ Inject custom CSS keyframes + pause on hover
const styles = `
@keyframes scroll-x {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.scroll-container {
  display: flex;
  gap: 1.5rem;
  animation: scroll-x 10s linear infinite;
}
.scroll-container:hover {
  animation-play-state: paused;
}
`;

const products = [
  {
    id: 1,
    name: "Spotlight 1",
    image:
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=1200&auto=format&fit=crop",
    price: "₹1,299",
    description: "Premium cotton tee with soft hand-feel.",
    colors: [
      {
        hex: "#111827",
        image:
          "https://images.unsplash.com/photo-1520975682031-ae3d9e6b7b10?q=80&w=1200&auto=format&fit=crop",
      },
      {
        hex: "#EF4444",
        image:
          "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
      },
      {
        hex: "#10B981",
        image:
          "https://images.unsplash.com/photo-1520975351596-645b62e2f5c4?q=80&w=1200&auto=format&fit=crop",
      },
      {
        hex: "#3B82F6",
        image:
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Spotlight 2",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
    price: "₹1,099",
    description: "Relaxed fit for everyday comfort.",
    colors: [
      {
        hex: "#1F2937",
        image:
          "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1200&auto=format&fit=crop",
      },
      {
        hex: "#F59E0B",
        image:
          "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=1200&auto=format&fit=crop",
      },
      {
        hex: "#22C55E",
        image:
          "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    sizes: ["M", "L", "XL"],
  },
  {
    id: 3,
    name: "Spotlight 3",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
    price: "₹899",
    description: "Breathable fabric, perfect for summer.",
    colors: [
      {
        hex: "#111827",
        image:
          "https://images.unsplash.com/photo-1511556820780-13bb57c669f0?q=80&w=1200&auto=format&fit=crop",
      },
      {
        hex: "#6B7280",
        image:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    sizes: ["S", "M", "L"],
  },
];

const SpotlightProducts = () => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const setColor = (id, colorObj) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), color: colorObj },
    }));
  };

  const setSize = (id, size) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), size },
    }));
  };

  return (
    <div className="w-screen mx-auto py-16 px-4">
      {/* Inject custom styles */}
      <style>{styles}</style>

      <h2 className="text-3xl font-extrabold mb-10 text-center text-black">
        Spotlight Products
      </h2>

      <div className="relative w-screen overflow-hidden">
        <div className="scroll-container pr-6">
          {[...products, ...products].map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="relative aspect-square min-w-[260px] sm:min-w-[26rem] overflow-hidden group rounded-lg shadow-lg bg-white"
            >
              {/* Product Image */}
              <img
                src={
                  selectedOptions[product.id]?.color?.image || product.image
                }
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Always visible on mobile */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent text-white p-3 flex flex-col items-center md:hidden">
                <h3 className="text-base font-semibold">{product.name}</h3>
                <p className="text-xs opacity-90 mt-0.5 line-clamp-2 text-center">
                  {product.description}
                </p>
                <p className="text-sm mt-1">{product.price}</p>
              </div>

              {/* Visible on hover (desktop) */}
              <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex-col justify-end items-stretch text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-xs opacity-90 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <p className="text-sm font-semibold whitespace-nowrap">
                    {product.price}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Color Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Color</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.colors.map((colorObj) => (
                        <button
                          key={colorObj.hex}
                          onClick={(e) => {
                            e.stopPropagation();
                            setColor(product.id, colorObj);
                          }}
                          
                          className={` rounded-full border-2 transition-all ${
                            selectedOptions[product.id]?.color?.hex ===
                            colorObj.hex
                              ? "border-orange-400 scale-105"
                              : "border-white/60"
                          }`}
                          style={{ backgroundColor: colorObj.hex,
                                  height: '30px',
                            width: '30px',
                            borderRadius: '50%',
                            borderColor: colorObj.hex,
                            display: "inline-block",
                            margin: "0px",
                            padding: "0px",
                            marginRight: "1px",
                            marginLeft: "1px",
                            marginTop: "1px",
                            marginBottom: "1px",
                          }}
                          aria-label={`Select color ${colorObj.hex}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div>
                    <div className="flex items-center justify-end mb-2">
                      <span className="text-sm font-medium">Size</span>
                    </div>
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSize(product.id, size);
                          }}
                          className={`px-3 py-1.5 rounded-md text-xs border transition-all ${
                            selectedOptions[product.id]?.size === size
                              ? "border-orange-400 text-orange-200 bg-orange-500/20"
                              : "border-white/50 text-white bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotlightProducts;

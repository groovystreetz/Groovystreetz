import React from "react";

const partners = [
  { name: "Amazon", logo: "/logos/amazon.png" },
  { name: "Flipkart", logo: "/logos/flipkart.png" },
  { name: "Meesho", logo: "/logos/meesho.png" },
  { name: "Myntra", logo: "/logos/myntra.png" },
  { name: "Shopify", logo: "/logos/shopify.png" },
  { name: "Ajio", logo: "/logos/ajio.png" },
];

function SellingPartners() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-gray-100 py-4 mt-10">
      <div className="flex animate-marquee" style={{ animationDuration: "10s" }}>
        {/* Duplicate the array twice for smooth looping */}
        {[...partners, ...partners].map((partner, idx) => (
          <div
            key={idx}
            className="flex items-center px-5 text-gray-700 font-semibold"
          >
            {partner.logo ? (
              <img src={partner.logo} alt={partner.name} className="h-8" />
            ) : (
              partner.name
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}

export default SellingPartners;

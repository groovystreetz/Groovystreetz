import React from "react";

const items = [
  {
    titleTop: "KOREAN",
    titleBottom: "LOOK",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRHVyGHEWhk0FFNAHnBcVDcvwWdefC06moHOdLR2-CJc3Ls7SUdCJbctkDxJiNrzxY4Io32FbmihCLXBNSXB1Qt-Leuo3pjlycCyFCrDSPI9o_fZLXxU1nB0k7dpW-DKZhiOd3rt-u3Pqn2u2WdB6FfOYoQUDLT8WKKzJ9hr0gFHyB_uZpxotuoAo1COrSWna9On0u-EccHmu9Jg4mm_pNec3ebkIMAY9VV0YjvPgZdVVqE4PPMekuIhd-VrTA6IHeLUx1MAS_IOXL",
    alt: "A person wearing a grey hoodie and dark pants, with text overlay 'KOREAN LOOK'",
  },
  {
    titleTop: "TEXTURED",
    titleBottom: "POLOS",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD6v6I2f423ZJmVSToSvdT3ZG6yRTdDtG5q6CYtUPDp1Vi5dEgwmPAZXHzKaN4N0u9Z62pVSd3116_Jfd94s6bYsKxKDbub_h_D-O54VyofCYC6QYyMMBss0PrrwE9rwfYC7BEcq-9dy-c-8nBb18TYFKY9uyhRNvERFOd8FfIZoyu1ALkzOiBXXQSMlIyL5xkuRNwbVua1IpA_M9ULqxMpGW62pAGOxQAyb-h_bgGSaESshmhvgomQD_zi6J5I7XrxNegiFBsMf0X",
    alt: "A man in a beige textured polo shirt, with text overlay 'TEXTURED POLOS'",
  },
  {
    titleTop: "PLAID",
    titleBottom: "SHIRTS",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0IcibnnFJ-wUq6r_I-OqGvAoGhHKui8T7OBoDsR62-c9t9_dOdDtCW_OwQ48iqlUmCL6SNahAyGtwQRnmwN9Ca1UtrJyftaC4NZMHVC7BrCZfwX3cdGp3NfhH5y8VNkEHE6VWb6hdODQt9Qjk2YRo16YCQ5UzWjhvglX0eZXW782yXwAyM8NcT0Uve2-t4uBbZ94pBfTw_S5TsW5ohNbp78w8TDrFTRGPMv3pMkTS4E3jQ3jYx96rP6bSKKtjIAnsCg0RKGkbjGkm",
    alt: "A man wearing a plaid shirt over a dark t-shirt, with text overlay 'PLAID SHIRTS'",
  },
];

const NoPrint = () => {
  // const scrollRef = useRef(null);

  // const scroll = (direction) => {
  //   if (!scrollRef.current) return;
  //   const { scrollLeft, clientWidth } = scrollRef.current;
  //   const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
  //   scrollRef.current.scrollTo({
  //     left: scrollLeft + scrollAmount,
  //     behavior: "smooth",
  //   });
  // };

  return (
    <div className="w-full max-w-[95%] mx-auto py-12">
      <h2 className="text-center text-2xl font-bold tracking-wider mb-8">
        No Print
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div key={idx} className="relative rounded-none overflow-hidden group">
            <img
              src={item.img}
              alt={item.alt}
              className="w-full h-full object-cover rounded-none"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end text-white text-center pb-12 bg-black/20">
              <p className="text-lg font-light">{item.titleTop}</p>
              <p className="text-5xl font-bold">{item.titleBottom}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoPrint;

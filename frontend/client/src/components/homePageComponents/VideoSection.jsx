import React from "react";

const LeftIcon = () => (
  <span className="material-icons text-gray-600" style={{ fontSize: 32 }}>
    chevron_left
  </span>
);
const RightIcon = () => (
  <span className="material-icons text-gray-600" style={{ fontSize: 32 }}>
    chevron_right
  </span>
);

const picks = [
  {
    rank: 1,
    title: "Pull On Denims: Grey",
    category: "Shorts",
    price: "₹ 1999",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNVsjB081LPB-e8Q3fSjx7bctbMFEVlGRBaKC3b2yBHctsPEkKiq788gdOXrwOVmgaWOcDFt_BovKZx-QsBGbeiKbRAEkp54BsuQ6BfqyPukZFhz4bmk8CyxbSwMs3kHu1UPtX5xWH44rwLRHjnmIdgEListXWo2KRuvl6fyKPSl7VkhNW5W_EfrM4-H7gInsUHhUmAmUHzsJAjpSxYC4r5xsyh35qX6g0NFBL79UpViN0p96laktnJN_7Osz-6xyAWwPwvoXijuM",
    alt: "Man wearing grey pull-on denims sitting on a stool",
  },
  {
    rank: 2,
    title: "TSS Originals: Rider's Soul",
    category: "Supima T-shirt",
    price: "₹ 1299",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0pmCCpzB8qbQ6kEp_okDqoi-eiFmGi0RpFZzgECDin8ypZ7QFsc3eZN9a6w6CjIKJMkAS3kXowkDLJ3xxDvD-ajTB_x4VemtJgMRU1-1rqBAtvCdBU7PAvK644DtxiXmAs-WwgZ3a28PlSrs_V2R87w-M-Fwr-NCju7OIEnN7p03zENSa1VRMg2FmXvyRMhF_Mdkv71Klo6npV-65iyW6BsT7ZFnUMnziFz7iRIJ4kIcOeCvozJ_JoQvK4w1F7ZaYy-3nqndxGaw",
    alt: "Man wearing a dark green Rider's Soul t-shirt",
  },
  {
    rank: 3,
    title: "Gurkha Pants: Light Olive",
    category: "Pants",
    price: "₹ 2599",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAA8iAJR2ql-glqPSsD2_z2ZISr_QrclqXhVlG5gJDshhNMyfhEqjQgRKe8NUppZa48oRaiBOPSI705QoS1OHhv7yUGDgkySYSx0IPRYCOHmiK1b52BoDvGeAOh0v753mtTUjTHA_OEMPNQFPrWw8xhgu4H-rRlNzHiUX07d7q1ngXaE-GbCv9qAtyJ3slYoZYhI6sow3DuXaihzWG9ncEaMst-pAFJhwNQrxaiGAxLqCEsNKLQst-qBWQDapHIcsOzZaZIuoa58Vs",
    alt: "Man wearing light olive Gurkha pants",
  },
  {
    rank: 4,
    title: "Attack On Titan: Captain Levi",
    category: "Jeans",
    price: "₹ 799",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMDOLKvVWe-zMoBMVqaao7Nljsi-gClRcTQCl5_N4JLhq-6upJHoqPoyusqX42PMydc72ubX3_u8SERlEGmT3BIKgYLzy6aSo5m8hHZ60H0zooc7NEcZxPUWmtpquaAiigEiAylB2gayaDAEWThvAja5Duoa8-DCeWudQC5T2tXZbhnC_l3INPjd8w0ZAOyZzo8XZBhpJN9QudGkTHl1gfnDLeCd4iOrBGCTQ7eyVKcyUAAFxmIQc6h4sTEFPIKx5yzbTGvh5p9ug",
    alt: "Man wearing an Attack on Titan Captain Levi t-shirt",
  },
  {
    rank: 5,
    title: "Attack On Titan: Captain Levi",
    category: "Jeans",
    price: "₹ 799",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMDOLKvVWe-zMoBMVqaao7Nljsi-gClRcTQCl5_N4JLhq-6upJHoqPoyusqX42PMydc72ubX3_u8SERlEGmT3BIKgYLzy6aSo5m8hHZ60H0zooc7NEcZxPUWmtpquaAiigEiAylB2gayaDAEWThvAja5Duoa8-DCeWudQC5T2tXZbhnC_l3INPjd8w0ZAOyZzo8XZBhpJN9QudGkTHl1gfnDLeCd4iOrBGCTQ7eyVKcyUAAFxmIQc6h4sTEFPIKx5yzbTGvh5p9ug",
    alt: "Man wearing an Attack on Titan Captain Levi t-shirt",
  },
];

function VideoSection() {
  return (
    <div className="w-full max-w-[95%] mx-auto py-12 px-2">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
        TOP  PICKS OF THE WEEK
      </h2>
      <div className="relative">
        <div className="flex items-center">
          <div className="flex gap-3 overflow-x-auto w-full px-2 pl-9" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style>
            
            </style>
            {picks.map((item) => (
              <div
                key={item.rank}
                className="relative flex-shrink-0 w-64 group"
              >
                <div className="absolute inset-0 flex items-center">
                  <span className="text-9xl font-bold text-gray-300 opacity-80 -ml-11">
                    {item.rank}
                  </span>
                </div>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out group-hover:shadow-xl">
                  <img
                    alt={item.alt}
                    className="w-full h-80 object-cover"
                    src={item.image}
                  />
                </div>
                <div className="pt-4">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                  <p className="text-gray-800 font-medium mt-1">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoSection;

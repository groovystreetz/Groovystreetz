import React, { useState } from "react";
import { Star } from "lucide-react";
import { ProductImageLens } from "../components/ProductImageLens";
import ProductCard from "../components/products/CARDpRODUCT";
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

const PRODUCT = {
  name: "Super Pants: Eclipse Stripes",
  category: "Men Super Flex Pants",
  brand: "The Souled Store",
  price: 2599,
  images: [
    "https://bananaclub.co.in/cdn/shop/files/DeepBlackGurkhaPant_3.jpg?v=1738820001&width=1000",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC05xK1qVmniStT4aGT7MlUYbid11UTY2erX_bcK1hHRfuh3NJ78rTkS-1kvuYIwvxvN3WYb9C6tdm8oHtwmNwzT_MpEo0IRbY8YCryjkWX0XWo77D05Oy6fWOD71gUUoKdl9oMXaxg1sX6Jut70pNhZ7_DLfD3n09pIFyZJgt-4drr96ImZ9U4eGHm0PYl-dA0W8W-jpF-h6k4HJ2ROu2c-u9X-pSd6Dt4xQDDBaAFAagGF1FcLy106S2Zdoj95c0d98PqbLDFjMQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAw8sIIEkraxk5iU08CmyPk7UpANyc31kkJf1J4-du_CfdOfkM_ybCYPY4r9D4C7BjdNFySaId8I5xPfnySuXdwLbcJD7_eZwXMH80Ngzftnyy4syCaPQlgpsJRbbA6e_JXsJ9sMuQ_upq4_aHsYc2IP4uomQ6i8xND2WHra5DWB4Krp66gtQBnSpBXoIX2fhWh5aFyv7ijufQK6MAp_US1DnOthPd1lXeU0B94e953tM7fBGbIjdg_OOqOXvf4GvSufwx08wRd4rE",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB_po9E46oVDD87XT0wRPCDBsnRDadH-wzFAjp9QSVNIPrZEA4i8MxAiqKczlLW4t-J64RKCiPnqxI9Oh38OTI3aknMUG8eYrQX4yLokpREjTIf4olkthhz1E3r6Tz5pMR34b8N44T7sDN_h_whFXJKVmzfEsLi3xKJ7ruERXehtV5MgaCxo4_zEts5aOR77dH0TMEitIDKUxDk7cP2-T-wRk30C9Ej0KESeBqEMEIm_OawNMx-31odpvOaTY1yIayxRl52rHtueMk",
  ],
  features: [
    {
      icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmaZCyV1fvGXN2FedVRZbXqp-5sdqskeM6JbAdds1v1nVGJS_03WydMdJHbV--DpuQpVVPV5stx5CjTOJTZI7fs4vlsThtzMKogk4fwySQLPRBTqtPe7k9yNTdxYPNmfm3SSx8p8BwAWHoeCpOvzQ7uH3nTCIgKFiB1j3QO69eEzCKrJMb1eOn4r-FYaVdWRHXJh7ONNIwc2lwRrgw_Ee7DVh0V7kgAVsTBVK-nRq8ZYNmRGdBT2nXio3fie176L161OzTLaTsddI",
      label: "Classic Fit",
    },
    {
      icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPymX2qzzzFe24ZeI43J127pcABHlOdQMRd-GmV2_CCfkbA5hq070exk_-v0eK3goLhcI7LSV945frJ2ie-k3rC-s9JRDDeTveNpHZt39HJfd8UpNE0Pc8Njt81BNfBUKBr2zQAuIhzhcm94kGR1J7J31mC7RhmxamUqmtp1kFeg-x1PL2dCQ0Qw_F7MvDEJIiQkp_NOaunJoy0X-cSKrjPYxbu9V2ctiUjSnSljsQ_WgA1io3LWZ9c6Q8WAUbgjZoSxQOEe0TN3o",
      label: "Comfortable Inside Drawcord",
    },
    {
      icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiY4aaCMIaaERiMP_BIa4LylyOEXDAvmkKmjQmhs1BS7xRM8ymH3SLzUNhnGuruNqORPmEt_VmdIpAvsF1BxU6rXS9tQRP9YrlDW03z_Eepf8wcR4CJdN-AHLWnlMj11UcovcwlYDRjHLTciscpKXzoPOhmYJuQ7RurDaz0C_MM9j-O_FhDTIvcdKnmjFxVVe0FAFjq0CaR0Lkm4Ozl3hBYiRihtfwFbAnKsQLZOqnpnpadt3KunOqKmMsl19I-Kz_cNYD8C6sMQM",
      label: "Wrinkle-Resistant",
    },
  ],
  variants: [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw8sIIEkraxk5iU08CmyPk7UpANyc31kkJf1J4-du_CfdOfkM_ybCYPY4r9D4C7BjdNFySaId8I5xPfnySuXdwLbcJD7_eZwXMH80Ngzftnyy4syCaPQlgpsJRbbA6e_JXsJ9sMuQ_upq4_aHsYc2IP4uomQ6i8xND2WHra5DWB4Krp66gtQBnSpBXoIX2fhWh5aFyv7ijufQK6MAp_US1DnOthPd1lXeU0B94e953tM7fBGbIjdg_OOqOXvf4GvSufwx08wRd4rE",
      alt: "A man wearing grey pinstripe pants, showing a side view.",
      selected: true,
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_po9E46oVDD87XT0wRPCDBsnRDadH-wzFAjp9QSVNIPrZEA4i8MxAiqKczlLW4t-J64RKCiPnqxI9Oh38OTI3aknMUG8eYrQX4yLokpREjTIf4olkthhz1E3r6Tz5pMR34b8N44T7sDN_h_whFXJKVmzfEsLi3xKJ7ruERXehtV5MgaCxo4_zEts5aOR77dH0TMEitIDKUxDk7cP2-T-wRk30C9Ej0KESeBqEMEIm_OawNMx-31odpvOaTY1yIayxRl52rHtueMk",
      alt: "A close-up of the grey pinstripe pants.",
      selected: false,
    },
  ],
  sizes: [
    { label: "28", selected: false },
    { label: "30", selected: false },
    { label: "32", selected: true },
    { label: "34", selected: false },
    { label: "36", selected: false },
    { label: "38", selected: false },
    { label: "40", selected: false },
  ],
  share: [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "#25D366",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "#1877F2",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "#1DA1F2",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "#E4405F",
    },
  ],
};

const SIZES = ["28", "30", "32", "34", "36", "38", "40"];
const QUANTITIES = ["01", "02", "03"];

const SIZE_CHART = {
  inches: {
    headers: ["Size", "Fit To Waist", "Garment Waist", "Fit To Hips", "Inseam Length"],
    data: [
      ["28", "28-29", "27", "34", "29.5"],
      ["30", "30-31", "29", "36", "29.5"],
      ["32", "32-33", "31", "38", "29.5"],
      ["34", "34-35", "33", "40", "29.5"],
      ["36", "36-37", "35", "42", "29.5"],
      ["38", "38-39", "37", "44", "29.5"],
      ["40", "40-41", "39", "45", "29.5"],
    ]
  },
  cm: {
    headers: ["Size", "Fit To Waist", "Garment Waist", "Fit To Hips", "Inseam Length"],
    data: [
      ["28", "71-74", "69", "86", "75"],
      ["30", "76-79", "74", "91", "75"],
      ["32", "81-84", "79", "97", "75"],
      ["34", "86-89", "84", "102", "75"],
      ["36", "91-94", "89", "107", "75"],
      ["38", "96-99", "94", "112", "75"],
      ["40", "101-104", "99", "114", "75"],
    ]
  }
};

function ProductTest() {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState("32");
  const [quantity, setQuantity] = useState("01");
  const [sizeUnit, setSizeUnit] = useState("inches");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [reviews, setReviews] = useState([
    {
      id: "r1",
      user: "Aman Sharma",
      rating: 5,
      comment: "Great fit and very comfortable for office wear!",
      date: new Date().toISOString(),
      images: [],
    },
    {
      id: "r2",
      user: "Priya Verma",
      rating: 4,
      comment: "Quality is good. Slightly long in length but manageable.",
      date: new Date(Date.now() - 86400000).toISOString(),
      images: [
        "https://bananaclub.co.in/cdn/shop/files/DeepBlackGurkhaPant_3.jpg?v=1738820001&width=1000",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC05xK1qVmniStT4aGT7MlUYbid11UTY2erX_bcK1hHRfuh3NJ78rTkS-1kvuYIwvxvN3WYb9C6tdm8oHtwmNwzT_MpEo0IRbY8YCryjkWX0XWo77D05Oy6fWOD71gUUoKdl9oMXaxg1sX6Jut70pNhZ7_DLfD3n09pIFyZJgt-4drr96ImZ9U4eGHm0PYl-dA0W8W-jpF-h6k4HJ2ROu2c-u9X-pSd6Dt4xQDDBaAFAagGF1FcLy106S2Zdoj95c0d98PqbLDFjMQ",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAw8sIIEkraxk5iU08CmyPk7UpANyc31kkJf1J4-du_CfdOfkM_ybCYPY4r9D4C7BjdNFySaId8I5xPfnySuXdwLbcJD7_eZwXMH80Ngzftnyy4syCaPQlgpsJRbbA6e_JXsJ9sMuQ_upq4_aHsYc2IP4uomQ6i8xND2WHra5DWB4Krp66gtQBnSpBXoIX2fhWh5aFyv7ijufQK6MAp_US1DnOthPd1lXeU0B94e953tM7fBGbIjdg_OOqOXvf4GvSufwx08wRd4rE",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB_po9E46oVDD87XT0wRPCDBsnRDadH-wzFAjp9QSVNIPrZEA4i8MxAiqKczlLW4t-J64RKCiPnqxI9Oh38OTI3aknMUG8eYrQX4yLokpREjTIf4olkthhz1E3r6Tz5pMR34b8N44T7sDN_h_whFXJKVmzfEsLi3xKJ7ruERXehtV5MgaCxo4_zEts5aOR77dH0TMEitIDKUxDk7cP2-T-wRk30C9Ej0KESeBqEMEIm_OawNMx-31odpvOaTY1yIayxRl52rHtueMk",
      ],
    },
  ]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (imagesArray, startIndex = 0) => {
    setLightboxImages(imagesArray || []);
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImages([]);
    setLightboxIndex(0);
  };

  const nextLightbox = () => {
    if (!lightboxImages.length) return;
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevLightbox = () => {
    if (!lightboxImages.length) return;
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const handleReviewImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    const next = files.slice(0, 5 - reviewImages.length).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setReviewImages((prev) => [...prev, ...next]);
  };

  const removeReviewImage = (indexToRemove) => {
    setReviewImages((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(indexToRemove, 1);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return updated;
    });
  };

  const submitReview = () => {
    if (!reviewRating || reviewComment.trim().length === 0) return;
    const newReview = {
      id: `r-${Date.now()}`,
      user: "You",
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString(),
      images: reviewImages.map((img) => img.previewUrl),
    };
    setReviews((prev) => [newReview, ...prev]);

    setReviewRating(0);
    setHoverRating(0);
    setReviewComment("");
    setReviewImages([]);
  };

  return (
    <div className="bg-white  min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm text-gray-500 mb-8">
          Home / Men Super Flex Pants / The Souled Store / Super Pants: Eclipse Stripes
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images and Features */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Masonry-style image grid, full image display */}
            <div className="lg:col-span-10 order-2 lg:order-1">
              <div className="columns-2 gap-4 space-y-4">
                {PRODUCT.images.map((image, index) => (
                  <ProductImageLens
                    key={index}
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="mb-4"
                    zoomFactor={2.5}
                    lensSize={180}
                  />
                ))}
              </div>
              {/* You might like - Masonry style below images */}
              <div className="mt-8">
                <h3 className="text-base font-semibold text-gray-900 mb-3">You might like</h3>
                <div className="columns-2 gap-4 space-y-4">
                  {[0,1,2,3,4,6,7].map((i) => (
                    <div key={i} className="break-inside-avoid">
                      <ProductCard />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Features */}
            {/* <div className="lg:col-span-2 order-1 lg:order-2 flex lg:flex-col justify-center items-center space-x-2 lg:space-x-0 lg:space-y-4">
              {PRODUCT.features.map((f, i) => (
                <div
                  key={f.label}
                  className="w-24 h-24 bg-gray-100 p-2 rounded-lg flex flex-col items-center justify-center text-center"
                >
                  <img alt={f.label + " icon"} className="h-10 mb-2" src={f.icon} />
                  <span className="text-xs text-gray-700">{f.label}</span>
                </div>
              ))}
            </div> */}
          </div>
          {/* Right: Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{PRODUCT.name}</h1>
            <p className="text-gray-500 mt-1">{PRODUCT.category}</p>
            <p className="text-3xl font-bold text-gray-900 mt-4">₹ {PRODUCT.price}</p>
            <p className="text-sm text-gray-500">Price incl. of all taxes</p>
            {/* Variants */}
            <div className="mt-6">
              <h2 className="text-sm font-medium text-gray-900">Shop by Variant/Look</h2>
              <div className="flex space-x-4 mt-2">
                {PRODUCT.variants.map((v, idx) => (
                  <div
                    key={v.src}
                    className={
                      (idx === selectedVariant
                        ? "border-2 border-blue-500 "
                        : "border border-gray-200 ") +
                      "rounded-lg p-1 cursor-pointer"
                    }
                    onClick={() => setSelectedVariant(idx)}
                  >
                    <img
                      alt={v.alt}
                      className="w-24 h-24 object-cover rounded-md"
                      src={v.src}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Sizes */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-900">Please select a size.</h2>
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      SIZE CHART
                    </button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-2xl">
                    <SheetHeader>
                      <SheetTitle>Size Chart</SheetTitle>
                      <SheetDescription>
                        Find your perfect fit using the measurements below
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="mt-6">
                      {/* Unit Toggle */}
                      <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 rounded-lg p-1 flex">
                          <button
                            onClick={() => setSizeUnit("inches")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              sizeUnit === "inches"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            Inches
                          </button>
                          <button
                            onClick={() => setSizeUnit("cm")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              sizeUnit === "cm"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            CM
                          </button>
                        </div>
                      </div>

                      {/* Size Chart Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-gray-50">
                              {SIZE_CHART[sizeUnit].headers.map((header, index) => (
                                <th
                                  key={index}
                                  className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {SIZE_CHART[sizeUnit].data.map((row, rowIndex) => (
                              <tr
                                key={rowIndex}
                                className={`${
                                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-gray-100 transition-colors`}
                              >
                                {row.map((cell, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className={`border border-gray-300 px-4 py-3 text-sm ${
                                      cellIndex === 0
                                        ? "font-semibold text-gray-900"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Measurement Guide */}
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">How to Measure:</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• <strong>Fit To Waist:</strong> Measure around your natural waistline</li>
                          <li>• <strong>Garment Waist:</strong> The actual waist measurement of the garment</li>
                          <li>• <strong>Fit To Hips:</strong> Measure around the fullest part of your hips</li>
                          <li>• <strong>Inseam Length:</strong> Measure from crotch to ankle</li>
                        </ul>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    className={
                      "w-12 h-10 border rounded-md text-sm " +
                      (selectedSize === size
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-300")
                    }
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Quantity */}
            <div className="mt-6 flex items-center space-x-8">
              <div>
                <label
                  className="text-sm font-medium text-gray-900"
                  htmlFor="quantity"
                >
                  Quantity
                </label>
                <div className="relative mt-1">
                  <select
                    className="appearance-none w-24 bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  >
                    {QUANTITIES.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <span className="material-icons text-sm">expand_more</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Add to Cart & Wishlist */}
            <div className="mt-8 flex items-center space-x-4">
              <button className="flex-grow bg-[#F57C26] hover:bg-[#ce6b25] text-white font-bold py-3 px-6 rounded-lg">
                ADD TO CART
              </button>
              <button className="flex items-center justify-center border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg">
                <span className="material-icons mr-2">favorite_border</span>
                ADD TO WISHLIST
              </button>
            </div>
 {/* Share */}
 <div className="mt-6 flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">Share</span>
              {PRODUCT.share.map((s) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={s.name}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    href="#"
                    tabIndex={0}
                    title={`Share on ${s.name}`}
                  >
                    <IconComponent 
                      className="h-6 w-6" 
                      style={{ color: s.color }}
                    />
                  </a>
                );
              })}
            </div>
            {/* Delivery Details Section */}
            <div className="mt-10  rounded-lg bg-white  p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900 text-base">Delivery Details</span>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#F57C26] text-sm"
                />
                <button className="bg-white border border-[#25b89a] text-[#25b89a] font-semibold px-4 py-2 rounded-md text-sm hover:bg-[#25b89a] hover:text-white transition">
                  CHECK
                </button>
              </div>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2 mb-4">
                <span className="material-icons text-[#25b89a] mr-2" style={{ fontSize: 20 }}>verified_user</span>
                <span className="text-gray-700 text-sm">
                  This product is eligible for return or exchange under our 30-day return or exchange policy. No questions asked.
                </span>
              </div>
              {/* Product Details Accordion */}
              <Accordion type="multiple" defaultValue={["product-description", "product-details", "artist-details"]} className="w-full">
                <AccordionItem value="product-description" className="border rounded-md bg-white mb-2">
                  <AccordionTrigger className="px-4 py-3 font-semibold text-gray-900 text-base hover:no-underline">
                    Product Description
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 text-sm text-gray-800 space-y-4">
                    <div>
                      <span className="font-semibold text-gray-900">Material &amp; Care:</span>
                      <div className="ml-2 mt-1">
                        62% Polyester 34% Viscose 4% Elastane<br />
                        Machine Wash
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Country of Origin:</span>
                      <span className="ml-2">India (and proud)</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Manufactured &amp; Sold By:</span>
                      <div className="ml-2 mt-1">
                        The Souled Store Pvt. Ltd.<br />
                        224, Tantia Jogani Industrial Premises<br />
                        J.R. Boricha Marg<br />
                        Lower Parel (E)<br />
                        Mumbai - 400 011
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="product-details" className="border rounded-md bg-white mb-2">
                  <AccordionTrigger className="px-4 py-3 font-semibold text-gray-900 text-base hover:no-underline">
                    Product Details
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 text-sm text-gray-800 space-y-4">
                    <div>
                      <span className="font-semibold text-gray-900">Fit:</span>
                      <span className="ml-2">Classic Fit</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Closure:</span>
                      <span className="ml-2">Drawstring</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Pockets:</span>
                      <span className="ml-2">2 Side Pockets, 1 Back Pocket</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Occasion:</span>
                      <span className="ml-2">Casual, Office, Travel</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="artist-details" className="border rounded-md bg-white">
                  <AccordionTrigger className="px-4 py-3 font-semibold text-gray-900 text-base hover:no-underline">
                    Artist's Details
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 text-sm text-gray-800 space-y-4">
                    <div>
                      <span className="font-semibold text-gray-900">Design Inspiration:</span>
                      <div className="ml-2 mt-1">
                        Inspired by modern minimalist aesthetics with a touch of street style
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Designer:</span>
                      <span className="ml-2">The Souled Store Design Team</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Collection:</span>
                      <span className="ml-2">Eclipse Series</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Add Review Section */}
            <div className="mt-6 rounded-lg bg-white  p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900 text-base">Add a Review</span>
                <span className="text-xs text-gray-500">Max 5 images</span>
              </div>

              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-900 mb-2">Your Rating</span>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const starIndex = idx + 1;
                    const active = starIndex <= (hoverRating || reviewRating);
                    return (
                      <button
                        key={idx}
                        type="button"
                        className="p-1"
                        onMouseEnter={() => setHoverRating(starIndex)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(starIndex)}
                        aria-label={`Rate ${starIndex} star${starIndex > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={active ? "text-yellow-500" : "text-gray-300"}
                          style={{ width: 24, height: 24 }}
                          {...(active ? { fill: "currentColor" } : {})}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Comment</label>
                <textarea
                  className="w-full min-h-28 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F57C26]"
                  placeholder="Share your thoughts about this product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Add Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleReviewImageChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {reviewImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {reviewImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <button type="button" onClick={() => openLightbox(reviewImages.map(i => i.previewUrl), idx)} className="block w-full">
                          <img src={img.previewUrl} alt={`upload-${idx}`} className="w-full h-20 object-cover rounded-md border" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeReviewImage(idx)}
                          className="absolute -top-2 -right-2 bg-white border text-gray-700 rounded-full w-6 h-6 text-xs shadow hover:bg-gray-50"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={submitReview}
                  disabled={!reviewRating || reviewComment.trim().length === 0}
                  className={`px-5 py-2 rounded-md text-white font-semibold ${
                    !reviewRating || reviewComment.trim().length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#F57C26] hover:bg-[#ce6b25]"
                  }`}
                >
                  Submit Review
                </button>
              </div>
            </div>

            <div className="container mx-auto px-4 pb-10">
        <div className="mt-6 rounded-lg bg-white ">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-900 text-base">Customer Reviews</span>
            <span className="text-xs text-gray-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>
          {reviews.length === 0 ? (
            <div className="text-sm text-gray-600">No reviews yet. Be the first to review.</div>
          ) : (
            <div className="space-y-5">
              {reviews.map((rev) => (
                <div key={rev.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 text-sm">{rev.user}</div>
                    <div className="text-xs text-gray-500">{new Date(rev.date).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-1 flex items-center">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} style={{ width: 16, height: 16 }} className={idx < rev.rating ? 'text-yellow-500' : 'text-gray-300'} {...(idx < rev.rating ? { fill: 'currentColor' } : {})} />
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-800 whitespace-pre-line">{rev.comment}</div>
                  {rev.images && rev.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {rev.images.map((src, idx) => (
                        <button key={idx} type="button" onClick={() => openLightbox(rev.images, idx)} className="block w-full">
                          <img src={src} alt={`review-img-${idx}`} className="w-full h-20 object-cover rounded-md border" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
          </div>
        </div>
      </div>
      {/* Reviews List */}
   
      {/* Google Material Icons font */}
      {/* <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      /> */}
      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <button
            type="button"
            aria-label="Close"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-black text-2xl leading-none"
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Previous"
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-2xl"
          >
            ‹
          </button>
          <img
            src={lightboxImages[lightboxIndex]}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded"
          />
          <button
            type="button"
            aria-label="Next"
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black text-2xl"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductTest;

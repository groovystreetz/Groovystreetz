import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { ProductImageLens } from "../components/ProductImageLens";
import ProductCard from "../components/products/ProductCard";
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
import { useProduct } from "../hooks/useProduct";

// Share options for social media
const SHARE_OPTIONS = [
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
];

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

function ProductPage() {
  const { id } = useParams();
  const { product, isLoading, isError, error } = useProduct(id);
  
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState("01");
  const [sizeUnit, setSizeUnit] = useState("inches");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Extract data from API response
  const productImages = product?.images?.map(img => img.image) || [];
  const productVariants = product?.variants || [];
  const productReviews = product?.reviews || [];
  
  // Get unique sizes from variants using useMemo to prevent recreation on every render
  const availableSizes = useMemo(() => {
    return [...new Set(productVariants.map(variant => {
      const sizeMatch = variant.name.match(/\/([A-Z]+)$/);
      return sizeMatch ? sizeMatch[1] : 'S';
    }))];
  }, [productVariants]);

  // Set default selected size when product loads
  useEffect(() => {
    if (product && availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [product, availableSizes, selectedSize]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F57C26] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error?.message || "The product you're looking for doesn't exist."}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-[#F57C26] hover:bg-[#ce6b25] text-white font-bold py-2 px-4 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No product data
  if (!product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Product Data</h2>
          <p className="text-gray-600">Unable to load product information.</p>
        </div>
      </div>
    );
  }

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
    // TODO: Implement API call to submit review
    console.log('Submitting review:', {
      productId: product.id,
      rating: reviewRating,
      comment: reviewComment.trim(),
      images: reviewImages.map((img) => img.previewUrl),
    });

    setReviewRating(0);
    setHoverRating(0);
    setReviewComment("");
    setReviewImages([]);
  };

  return (
    <div className="bg-white  min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm text-gray-500 mb-8">
          Home / {product.category} / {product.name}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images and Features */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Masonry-style image grid, full image display */}
            <div className="lg:col-span-10 order-2 lg:order-1">
              <div className="columns-2 gap-4 space-y-4">
                {productImages.map((image, index) => (
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
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-500 mt-1">{product.category}</p>
            <p className="text-3xl font-bold text-gray-900 mt-4">₹ {product.price}</p>
            <p className="text-sm text-gray-500">Price incl. of all taxes</p>
            {/* Variants */}
            {productVariants.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-medium text-gray-900">Available Variants</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {productVariants.map((variant, idx) => (
                    <button
                      key={variant.id}
                      className={
                        (idx === selectedVariant
                          ? "border-2 border-blue-500 bg-blue-50 "
                          : "border border-gray-200 ") +
                        "rounded-lg p-2 cursor-pointer text-sm hover:bg-gray-50"
                      }
                      onClick={() => setSelectedVariant(idx)}
                    >
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-gray-600">₹{variant.final_price}</div>
                      <div className="text-xs text-gray-500">Stock: {variant.stock}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                {availableSizes.map((size) => (
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
              {SHARE_OPTIONS.map((s) => {
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
            <span className="text-xs text-gray-500">{productReviews.length} review{productReviews.length !== 1 ? 's' : ''}</span>
          </div>
          {productReviews.length === 0 ? (
            <div className="text-sm text-gray-600">No reviews yet. Be the first to review.</div>
          ) : (
            <div className="space-y-5">
              {productReviews.map((rev) => (
                <div key={rev.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 text-sm">{rev.user_name}</div>
                    <div className="text-xs text-gray-500">{new Date(rev.created_at).toLocaleDateString()}</div>
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

export default ProductPage;

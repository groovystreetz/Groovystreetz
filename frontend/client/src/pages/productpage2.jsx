import Banners from "@/components/homePageComponents/BannerSection";
import React, { useState } from "react";

const products = [
  {
    id: 1,
    title: "Iron Man: Mark L",
    subtitle: "Oversized T-Shirts",
    price: "₹ 1199",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBroUGfwUC4vdLR8yB1Rh1-fTwoDKbXztxezyefoEdCE70rwsxTpJm8Kw-3fLTbM3EacOBJeVzUCfsHR3ox5DVm9P2TIPcUJ5M2Ho8yZKDqDqcLdP1qskVu0TWGNnrsnRf2Go5t3Vldg8FY2P_9W_UoqoEa0IRDgJ1kEDgKAcJRFHCe70dAeHYPKW72nnW18O7pLj0L-FNV23cI6_i4auIprw0zbDVh5GaZf4tA-stY8LJQlq4MSA0Y_CyOYPe4sJGrT1pSOT_jgOG6",
    tagTop: "OVERSIZED FIT",
    tagBottom: "PREMIUM HEAVY GAUGE FABRIC",
  },
  {
    id: 2,
    title: "Harry Potter: The Silent Vow",
    subtitle: "Super Oversized T-Shirts",
    price: "₹ 1599",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwvK-i2kiSszDQes6SH0zgUpsK8EdupPPckCzsvYFaP9QlTSbuo9DtSyDO8Zj21yEoQe_XvrP92nTnqzBctOzBLC_SDhM-xQ69E_7hbgK3ZmQ9gBd_IYCw3oKp_jh1_kbq8qiyeR8sFH4WFaABGK9YfXNUVUQlA0sP-xPlSs9SGPcF79vbPOP85Se3ACvWIxdzJIQn-K0rE4zPDMZabfwAXjtBaCI7nH4byV6eFTHWF-buEB5caep1X3eaVOPTVJtEgbcyvUcwDM9v",
    tagTop: "SUPER OVERSIZED",
    tagBottom: "PREMIUM INTERLOCK FABRIC",
  },
  {
    id: 3,
    title: "TSS Originals: Kaal Chakra",
    subtitle: "Super Oversized T-Shirts",
    price: "₹ 1599",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6_oNSbwOtxkmFUlpYzi_-tkdFvyoGx3Rs5rBAanN5gmq-pe_ys_-5JrjympOhsGS2lfmzxhRlhG6omEDLm0_Ii1EbAR39IrMSuwaiHXMS-dPQjXEarjc4WsHX9DBvnRkvf6D70RjFxvblId1hvVvyyN8VtvEWrDf9so8EmNTOneAeCrdml-g975Q9mumFETxc2gUaAW9ftyOKgiHvEbhO_s_OZsFIB1ljNV8bo3HokYv71uI4OK1Z80H57HnvyGUcvxTaNATmSFOa",
    tagTop: "SUPER OVERSIZED",
    tagBottom: "PREMIUM HEAVY GAUGE FABRIC",
  },
  {
    id: 4,
    title: "Ted The Stoner: Split",
    subtitle: "Oversized T-Shirts",
    price: "₹ 999",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSFn2aGmZwQmLGvckKSW1cadq6j-u7K6WBa64ynTjFn2Vifn1UnP8HoXjwcEkitsjoMgiUUvRoxGHcTABV99udLhl3Psd2GwtpVj9cJ39LmF_sVJx3kCsf3cdHQP9945EjCf7cezJGPnuFuhiayqvukxepmsut5mJJD9Zh7Sfu4MRMZ02Ipl00tZWbe7kBJ6m21zx-G02V5mjtI-r2hMs66z43EsQwJui3K9x0UAezycuiH-41KA4BqqDhL7DEpXzvSVH2Utnb4hF4",
    tagTop: "OVERSIZED FIT",
    tagBottom: "PREMIUM HEAVY GAUGE FABRIC",
  },
];

// Filter data
const categories = [
  "Bomber Neck Polos",
  "Cotton Linen Shirts", 
  "Drop Cut T-Shirts",
  "Easy Fit Full Sleeve T-Shirts",
  "Henley T-Shirts",
  "Hooded T-Shirts",
  "Mandarin Polos",
  "Men Full Sleeve T-Shirts",
  "Men Relaxed Fit T-Shirts"
];

const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const priceRanges = [
  { label: "Rs. 499 - Rs. 981", min: 499, max: 981 },
  { label: "Rs. 982 - Rs. 1464", min: 982, max: 1464 },
  { label: "Rs. 1465 - Rs. 1947", min: 1465, max: 1947 },
  { label: "Rs. 1948 - Rs. 2430", min: 1948, max: 2430 },
  { label: "Rs. 2431 - Rs. 2913", min: 2431, max: 2913 },
  { label: "Rs. 2914 - Rs. 3397", min: 2914, max: 3397 }
];

const themes = [
  "5 Star", "Archie Comics", "Attack On Titan", "Avatar", "Avatar: The Last Airbender",
  "BGMI", "Babil Khan", "Baki Hanma", "Ben 10", "Berlin", "Black Panther", "Captain America",
  "DC Comics", "Dragon Ball Z", "Friends", "Game of Thrones", "Harry Potter", "Iron Man",
  "Marvel", "Naruto", "One Piece", "Pokemon", "Spider-Man", "Star Wars", "Stranger Things",
  "The Office", "Thor", "Witcher", "X-Men"
];

export default function MenTShirts() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [themeSearch, setThemeSearch] = useState("");

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handlePriceToggle = (priceRange) => {
    setSelectedPrices(prev => 
      prev.includes(priceRange) 
        ? prev.filter(p => p !== priceRange)
        : [...prev, priceRange]
    );
  };

  const handleThemeToggle = (theme) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredThemes = themes.filter(theme => 
    theme.toLowerCase().includes(themeSearch.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Banners/>
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <nav className="text-sm text-gray-500 flex items-center space-x-1">
                <a href="#" className="hover:text-gray-700 text-black transition-colors">Home</a>
                <span>/</span>
                <span className="text-gray-900 font-medium">Men T-Shirts</span>
              </nav>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Men T-Shirts
                <span className="block sm:inline sm:ml-2 text-lg sm:text-xl font-normal text-gray-600">
                  1445 items
                </span>
              </h1>
            </div>
            <div className="relative w-full sm:w-auto">
              <select className="w-full sm:w-64 appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200">
                <option>Select Sorting Options</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Most Popular</option>
                <option>Best Rating</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-fit lg:sticky lg:top-8 order-1 lg:order-1">
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search for Categories"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredCategories.map((category) => (
                    <label key={category} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
                {categories.length > filteredCategories.length && (
                  <p className="text-xs text-gray-500 mt-2">+ {categories.length - filteredCategories.length} more</p>
                )}
              </div>

              {/* Size */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <label key={size} className="flex items-center justify-center cursor-pointer hover:bg-gray-50 p-2 rounded border border-gray-200">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700 ml-2">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prices */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Prices</h3>
                <div className="space-y-2">
                  {priceRanges.map((priceRange, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(priceRange)}
                        onChange={() => handlePriceToggle(priceRange)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{priceRange.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Themes */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Themes</h3>
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search for Themes"
                    value={themeSearch}
                    onChange={(e) => setThemeSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredThemes.map((theme) => (
                    <label key={theme} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedThemes.includes(theme)}
                        onChange={() => handleThemeToggle(theme)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{theme}</span>
                    </label>
                  ))}
                </div>
                {themes.length > filteredThemes.length && (
                  <p className="text-xs text-gray-500 mt-2">+ {themes.length - filteredThemes.length} more</p>
                )}
              </div>

              {/* Clear All Filters */}
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSizes([]);
                    setSelectedPrices([]);
                    setSelectedThemes([]);
                    setCategorySearch("");
                    setThemeSearch("");
                  }}
                  className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>
        {/* Product Grid */}
          <main className="flex-1 order-2 lg:order-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
                <div key={product.id} className="group bg-white rounded-none shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Image Container */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.img}
                  alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Top Tag */}
                    {product.tagTop && (
                      <div className="absolute top-3 left-3 bg-black bg-opacity-80 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {product.tagTop}
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm hover:shadow-md transition-all duration-200 group/wishlist">
                      <svg className="w-5 h-5 text-gray-400 group-hover/wishlist:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* Bottom Tag */}
                    {product.tagBottom && (
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-80 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {product.tagBottom}
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                      <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-6 py-2 rounded-full font-semibold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-50">
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {product.subtitle}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-lg font-bold text-gray-900">{product.price}</p>
                      <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-200">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>

        
        </div>

        {/* Load More Section */}
        <div className="mt-12 text-center">
          <button className="bg-white border-2 border-orange-300 hover:border-orange-400 text-orange-700 hover:text-orange-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
            Load More Products
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Showing 4 of 1445 products
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <button className="px-3 py-1 text-sm bg-orange-600 text-white rounded">1</button>
              <button className="px-3 py-1 text-sm text-orange-600 hover:text-orange-900 rounded">2</button>
              <button className="px-3 py-1 text-sm text-orange-600 hover:text-orange-900 rounded">3</button>
              <span className="px-3 py-1 text-sm text-gray-400">...</span>
              <button className="px-3 py-1 text-sm text-orange-600 hover:text-orange-900 rounded">362</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

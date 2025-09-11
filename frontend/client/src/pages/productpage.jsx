import React, { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import ProductGrid from '../components/products/ProductGrid'
import ProductFilters from '../components/products/ProductFilters'
import ProductQuickView from '../components/products/ProductQuickView'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select'
import { Input } from '../components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useProducts } from '@/hooks/useProducts'

// using centralized mock generator

// RatingStars moved to components/products/RatingStars.jsx

const ProductCard = ({ product, onQuickView }) => {
  const originalPrice = product.price + 200
  const discount = Math.max(5, Math.min(60, Math.round(100 - (product.price / originalPrice) * 100)))

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
      <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative">
          {/* Badge */}
          <div className="absolute left-3 top-3 z-10">
            <Badge className="bg-white/90 text-xs font-medium text-foreground backdrop-blur-sm">{product.badge}</Badge>
          </div>

          {/* Wishlist */}
          <div className="absolute right-3 top-3 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button aria-label="Add to wishlist" className="rounded-full bg-white/90 p-2 text-foreground shadow backdrop-blur-sm transition hover:scale-105">
                    <Heart className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Wishlist</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Media */}
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            onClick={() => onQuickView(product)}
            className="aspect-square w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          {/* Hover actions */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              size="sm"
              className="w-auto px-3 py-1.5 text-xs rounded-md shadow-sm"
              onClick={() => onQuickView(product)}
            >
              Quick View
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-auto px-3 py-1.5 text-xs rounded-md shadow-sm"
            >
              Add to Cart
            </Button>
          </div>
        </div>

        <CardHeader className="p-4">
          <CardTitle className="text-base line-clamp-1">{product.title}</CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold">₹{product.price}</span>
              <span className="text-xs text-muted-foreground line-through">₹{originalPrice}</span>
              <span className="text-xs font-medium text-green-600">{discount}% OFF</span>
            </div>
            <div className="flex items-center gap-2">
              <RatingStars value={product.rating} />
              <span className="text-xs text-muted-foreground">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-2">
            {product.colors.map((c, idx) => (
              <span key={idx} className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c }} />
            ))}
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.slice(0, 5).map((s) => (
              <span key={s} className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-foreground/80">
                {s}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-foreground/80">+{product.sizes.length - 5}</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// ProductFilters moved to components/products/ProductFilters.jsx

// ProductGrid moved to components/products/ProductGrid.jsx

// ProductQuickView moved to components/products/ProductQuickView.jsx

const ProductPage = () => {
  const [searchParams] = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sizes, setSizes] = useState([])
  const [fits, setFits] = useState([])
  const [sort, setSort] = useState('popularity')
  const [quick, setQuick] = useState(null)
  const [categorySlug, setCategorySlug] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  // Get category and search from URL query parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || searchParams.get('categories')
    const searchFromUrl = searchParams.get('search')
    
    setCategorySlug(categoryFromUrl)
    
    // Set search query from URL parameter
    if (searchFromUrl) {
      setSearchQuery(decodeURIComponent(searchFromUrl))
    }
  }, [searchParams])

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Update URL when search query changes
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams)
    
    if (searchQuery.trim()) {
      currentParams.set('search', encodeURIComponent(searchQuery.trim()))
    } else {
      currentParams.delete('search')
    }
    
    // Only update URL if the search parameter has actually changed
    const newSearchParam = currentParams.get('search')
    const currentSearchParam = searchParams.get('search')
    
    if (newSearchParam !== currentSearchParam) {
      const newUrl = `${window.location.pathname}${currentParams.toString() ? '?' + currentParams.toString() : ''}`
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchQuery, searchParams])

  const { products, isLoading, isError } = useProducts(categorySlug)

  // Map backend products to UI shape (ensure required fields exist)
  const mapped = (products || []).map((p) => ({
    id: p.id,
    title: p.name || p.title || 'Product',
    price: Number(p.price) || 0,
    image: p.image || '/images/product1.jpg',
    sizes: p.sizes || ['S', 'M', 'L', 'XL'],
    colors: p.colors || ['#000000', '#666666'],
    rating: p.rating || 4.2,
    badge: p.category || 'Featured',
    fit: p.fit || 'Regular',
  }))

  const filtered = useMemo(() => {
    let list = mapped.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    
    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase()
      list = list.filter((p) => 
        p.title.toLowerCase().includes(query) ||
        p.badge.toLowerCase().includes(query) ||
        p.fit.toLowerCase().includes(query)
      )
    }
    
    if (sizes.length) list = list.filter((p) => sizes.some((s) => p.sizes.includes(s)))
    if (fits.length) list = list.filter((p) => fits.includes(p.fit))
    switch (sort) {
      case 'price_asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'new':
        list = [...list].reverse()
        break
      default:
        break
    }
    return list
  }, [mapped, priceRange, sizes, fits, sort, debouncedSearchQuery])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container mx-auto px-4 py-6 mt-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {debouncedSearchQuery 
                ? `Search Results for "${debouncedSearchQuery}"` 
                : categorySlug 
                  ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Products`
                  : "Best-Selling Products"
              }
            </h1>
            <p className="text-sm text-muted-foreground">
              {debouncedSearchQuery 
                ? `Found ${filtered.length} products matching your search`
                : "Explore our curated selection"
              }
            </p>
          </div>
          <div className="hidden md:block">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="new">New Arrivals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products by name, category, or fit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Search Results Summary */}
          {debouncedSearchQuery && (
            <div className="mt-2 flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing results for "<span className="font-medium text-gray-900">{debouncedSearchQuery}</span>"
              </p>
              <span className="text-sm text-gray-500">•</span>
              <p className="text-sm text-gray-600">
                {filtered.length} of {mapped.length} products found
              </p>
              {filtered.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="ml-auto"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
          
          {/* Search Suggestions */}
          {!debouncedSearchQuery && searchQuery && (
            <div className="mt-2 text-xs text-gray-500">
              Try searching for: "T-Shirts", "Hoodies", "Regular Fit", "Casual", etc.
            </div>
          )}
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block">
            <ProductFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sizes={sizes}
              setSizes={setSizes}
              fits={fits}
              setFits={setFits}
              sort={sort}
              setSort={setSort}
              selectedCategory={categorySlug}
              setSelectedCategory={setCategorySlug}
            />
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div>Loading...</div>
            ) : isError ? (
              <div>Failed to load products.</div>
            ) : filtered.length === 0 && debouncedSearchQuery ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any products matching "{debouncedSearchQuery}"
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Try:</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Checking your spelling</li>
                    <li>• Using more general keywords</li>
                    <li>• Removing some filters</li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <ProductGrid products={filtered} onQuickView={setQuick} />
            )}
          </div>
        </div>
      </section>

      <Footer />

      <Dialog open={!!quick} onOpenChange={() => setQuick(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick View</DialogTitle>
          </DialogHeader>
          <ProductQuickView product={quick} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductPage
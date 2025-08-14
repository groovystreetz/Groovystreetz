import React, { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import ProductGrid from '../components/products/ProductGrid'
import ProductFilters from '../components/products/ProductFilters'
import ProductQuickView from '../components/products/ProductQuickView'
import { getMockProducts } from '../components/products/mock'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select'

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
  const [priceRange, setPriceRange] = useState([549, 1549])
  const [sizes, setSizes] = useState([])
  const [fits, setFits] = useState([])
  const [sort, setSort] = useState('popularity')
  const [quick, setQuick] = useState(null)

  const filtered = useMemo(() => {
    let list = getMockProducts(24).filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
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
  }, [priceRange, sizes, fits, sort])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container mx-auto px-4 py-6 mt-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">Best-Selling Men's T-Shirts</h1>
            <p className="text-sm text-muted-foreground">Price range: ₹549 – ₹1549 • Sizes: XXS to XXXL</p>
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
            />
          </div>

          <div className="flex-1">
            <ProductGrid products={filtered} onQuickView={setQuick} />
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
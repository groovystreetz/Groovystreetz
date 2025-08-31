import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useWishlist } from '@/hooks/useWishlist'
import useCartStore from '@/hooks/useCart'

const Wishlist = () => {
  const navigate = useNavigate()
  const { 
    wishlist, 
    totalItems, 
    totalValue, 
    isLoading, 
    isError, 
    removeFromWishlist, 
    clearWishlist 
  } = useWishlist()
  const { addToCart } = useCartStore()

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId)
  }

  const handleAddToCart = (product) => {
    // Default size and color - you might want to add a modal for selection
    addToCart(product, 1, 'M', '#000000')
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product.id)
  }

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Wishlist</h2>
            <p className="text-gray-600 mb-6">Failed to load your wishlist. Please try again.</p>
            <Button onClick={() => window.location.reload()} className="bg-orange-600 hover:bg-orange-700">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} • Total value: ₹{totalValue}
            </p>
          </div>
          
          {totalItems > 0 && (
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Wishlist
            </Button>
          )}
        </div>

        {totalItems === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your wishlist by browsing our products and adding items you love.
            </p>
            <Button 
              onClick={() => navigate('/products')} 
              className="bg-orange-600 hover:bg-orange-700"
            >
              Browse Products
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-orange-100 text-orange-800">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">4.2</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">₹{(Number(product.price) + 20).toFixed(2)}</span>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-gray-600">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewProduct(product.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>

                  {/* Remove from Wishlist */}
                  <Button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Heart className="h-4 w-4 mr-2 fill-red-500" />
                    Remove from Wishlist
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Wishlist

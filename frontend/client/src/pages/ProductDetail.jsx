import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, ChevronLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import axios from 'axios'
import useCartStore from '@/hooks/useCart'
import { useOrders } from '@/hooks/useOrders'
import { useWishlist, useWishlistCheck } from '@/hooks/useWishlist'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  // Cart and order hooks
  const { addToCart, getCartCount } = useCartStore()
  const { createOrder, loading: orderLoading, error: orderError } = useOrders()
  
  // Wishlist hooks
  const { addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist: checkWishlistStatus } = useWishlist()
  const { isInWishlist, isLoading: wishlistCheckLoading } = useWishlistCheck(id)
  
  // Local state for immediate UI feedback
  const [localWishlistStatus, setLocalWishlistStatus] = useState(false)
  
  // Update local state when API response comes back
  useEffect(() => {
    if (!wishlistCheckLoading) {
      setLocalWishlistStatus(isInWishlist)
    }
  }, [isInWishlist, wishlistCheckLoading])

  // Mock images for gallery (replace with actual product images)
  const productImages = [
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop',
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['#000000', '#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1']

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8000/api/products/${id}/`)
        setProduct(response.data)
      } catch (err) {
        setError('Failed to load product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    if (!selectedColor) {
      alert('Please select a color')
      return
    }

    addToCart(product, quantity, selectedSize, selectedColor)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const handleWishlist = () => {
    // Immediately update local state for instant UI feedback
    setLocalWishlistStatus(!localWishlistStatus)
    
    if (localWishlistStatus) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id)
    }
  }
  
  // Handle wishlist state changes from API
  useEffect(() => {
    if (!wishlistCheckLoading) {
      setLocalWishlistStatus(isInWishlist)
    }
  }, [isInWishlist, wishlistCheckLoading])

  const handleCheckout = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select both size and color')
      return
    }

    try {
      const orderData = {
        shipping_address: "123 Main St, Anytown, USA", // This should come from user input
        total_price: (Number(product.price) * quantity).toFixed(2),
        items: [
          {
            product: product.id,
            quantity: quantity,
            price: product.price
          }
        ]
      }

      const order = await createOrder(orderData)
      console.log('Order created:', order)
      alert('Order created successfully!')
      // Optionally navigate to order confirmation page
      // navigate(`/orders/${order.id}`)
    } catch (err) {
      console.error('Failed to create order:', err)
      alert('Failed to create order. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-24">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/products')} className="bg-orange-600 hover:bg-orange-700">
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const originalPrice = Number(product.price) + 20
  const discount = Math.round(((originalPrice - Number(product.price)) / originalPrice) * 100)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center gap-1 hover:text-orange-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div 
              className="aspect-square bg-gray-100 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-orange-500 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Category Badge */}
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mb-4">
                {product.category}
              </Badge>

              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.2 (128 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                {/* <span className="text-lg text-gray-500 line-through">₹{originalPrice}</span>
                <Badge className="bg-green-100 text-green-800">-{discount}%</Badge> */}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                </span>
              </div>
            </motion.div>

            <Separator />

            {/* Size Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Color Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold mb-3">Select Color</h3>
              <div className="flex gap-3">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-orange-500 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Quantity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 p-0"
                >
                  -
                </Button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 p-0"
                >
                  +
                </Button>
              </div>
            </motion.div>

            <Separator />

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 h-12"
                  disabled={!selectedSize || !selectedColor || product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  className={`h-12 px-6 transition-all ${
                    localWishlistStatus 
                      ? 'border-red-500 text-red-600 hover:bg-red-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  disabled={wishlistCheckLoading}
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      localWishlistStatus ? 'fill-red-500' : ''
                    }`} 
                  />
                </Button>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 h-12"
                disabled={!selectedSize || !selectedColor || product.stock === 0 || orderLoading}
              >
                {orderLoading ? 'Creating Order...' : 'Buy Now'}
              </Button>

              {/* Success Message */}
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg"
                >
                  <Check className="h-5 w-5" />
                  Added to cart successfully!
                </motion.div>
              )}

              {/* Error Message */}
              {orderError && (
                <div className="text-red-600 bg-red-50 p-3 rounded-lg">
                  {orderError}
                </div>
              )}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6"
            >
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span>Easy Returns</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductDetail

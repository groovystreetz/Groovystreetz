import React, { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import useCartStore from '@/hooks/useCart'
import { useOrders } from '@/hooks/useOrders'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const navigate = useNavigate()
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartCount 
  } = useCartStore()
  const { createOrder, loading: orderLoading, error: orderError } = useOrders()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item.id, item.size, item.color)
    } else {
      updateQuantity(item.id, newQuantity, item.size, item.color)
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Your cart is empty')
      return
    }

    try {
      const orderData = {
        shipping_address: "123 Main St, Anytown, USA", // This should come from user input
        total_price: getCartTotal().toFixed(2),
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price.toString()
        }))
      }

      const order = await createOrder(orderData)
      console.log('Order created:', order)
      setShowSuccess(true)
      clearCart()
      setTimeout(() => {
        setShowSuccess(false)
        navigate('/products')
      }, 2000)
    } catch (err) {
      console.error('Failed to create order:', err)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-24">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Badge className="bg-orange-100 text-orange-800">
              {getCartCount()} items
            </Badge>
          </div>
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="text-red-600 hover:text-red-700"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Motion.div
                key={`${item.id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {item.size && (
                            <span>Size: {item.size}</span>
                          )}
                          {item.color && (
                            <div className="flex items-center gap-2">
                              <span>Color:</span>
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                          <span className="text-sm text-gray-500">each</span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-orange-600 hover:bg-orange-700 h-12 mt-6"
                disabled={orderLoading}
              >
                {orderLoading ? 'Creating Order...' : 'Proceed to Checkout'}
              </Button>

              {/* Success Message */}
              {showSuccess && (
                <Motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center"
                >
                  Order created successfully! Redirecting...
                </Motion.div>
              )}

              {/* Error Message */}
              {orderError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-center">
                  {orderError}
                </div>
              )}
            </Motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Cart

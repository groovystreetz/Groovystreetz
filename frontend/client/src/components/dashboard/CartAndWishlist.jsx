import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Trash2, Heart, ShoppingCart, MapPin, CreditCard } from "lucide-react"

const CartAndWishlist = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Groovy Hoodie",
      price: 89,
      quantity: 2,
      image: "/placeholder.svg?height=100&width=100",
      size: "L",
      color: "Orange",
    },
    {
      id: 2,
      name: "Urban Joggers",
      price: 65,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
      size: "M",
      color: "Black",
    },
  ])

  const [selectedAddress, setSelectedAddress] = useState("")
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [couponInput, setCouponInput] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState("")

  const addresses = [
    {
      id: "1",
      type: "Home",
      name: "John Doe",
      address: "123 Street Name, City, State 12345",
      phone: "+1 234-567-8900",
      isDefault: true,
    },
    {
      id: "2",
      type: "Office",
      name: "John Doe",
      address: "456 Office Building, Business District, State 12345",
      phone: "+1 234-567-8900",
      isDefault: false,
    },
  ]

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  // Coupon logic
  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    setCouponError("")
    if (code === "SAVE10") {
      setAppliedCoupon({ code, type: "percent", value: 10 })
      setDiscount(cartTotal * 0.10)
    } else if (code === "FLAT20") {
      setAppliedCoupon({ code, type: "fixed", value: 20 })
      setDiscount(20)
    } else {
      setAppliedCoupon(null)
      setDiscount(0)
      setCouponError("Invalid coupon code. Try SAVE10 or FLAT20.")
    }
  }

  const totalAfterDiscount = Math.max(0, cartTotal - discount)
  const tax = totalAfterDiscount * 0.08
  const grandTotal = totalAfterDiscount + tax

  const handleCheckout = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address")
      return
    }
    // Proceed with checkout logic here
    console.log("Proceeding to checkout with address:", selectedAddress)
    setIsCheckoutOpen(false)
  }

  return (
    <div className="flex flex-col overflow-x-hidden  gap-6 lg:grid lg:grid-cols-3 lg:gap-6">
      {/* Cart */}
      <div className="space-y-4 lg:col-span-2">
      <Card className="glassmorphism rounded-2xl">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
      Shopping Cart ({cartItems.length} items)
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    {cartItems.map((item) => (
      <div
        key={item.id}
        className="flex flex-col sm:flex-row items-center gap-3 p-2 sm:p-4 bg-white/30 rounded-xl"
      >
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={64}
          height={64}
          className="rounded-lg object-cover mb-2 sm:mb-0 sm:w-20 sm:h-20 w-16 h-16"
        />

        <div className="flex-1 w-full">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-lg">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Size: {item.size} | Color: {item.color}
          </p>
          <p className="font-bold text-orange-600 text-sm sm:text-lg">
            ${item.price}
          </p>
        </div>
<div className="flex items-center gap-2 justify-between w-full">
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuantity(item.id, -1)}
            className="h-7 w-7 sm:h-9 sm:w-9 rounded-full"
          >
            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuantity(item.id, 1)}
            className="h-7 w-7 sm:h-9 sm:w-9 rounded-full"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
       
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeItem(item.id)}
          className="text-red-500 hover:text-red-700 mt-2 sm:mt-0 h-7 w-7 sm:h-9 sm:w-9"
        >
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        </div>
      </div>
    ))}
  </CardContent>
</Card>

        {/* Wishlist */}
        <Card className="glassmorphism rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Heart className="h-5 w-5" />
              Wishlist (3 items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white/30 rounded-xl p-4 text-center flex flex-col items-center"
                >
                  <img
                    src="/placeholder.svg?height=120&width=120"
                    alt="Wishlist item"
                    width={100}
                    height={100}
                    className="mx-auto rounded-lg mb-2"
                  />
                  <h4 className="font-semibold text-sm">Street Jacket</h4>
                  <p className="text-orange-600 font-bold">$95</p>
                  <Button
                    size="sm"
                    className="mt-2 w-full bg-orange-600 hover:bg-orange-700"
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-4 w-full max-w-full">
        <Card className="glassmorphism rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            {/* Coupon code input */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
              <input
                type="text"
                className="rounded-xl border px-3 py-2 flex-1 min-w-0"
                placeholder="Enter coupon (e.g. SAVE10, FLAT20)"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
                disabled={!!appliedCoupon}
              />
              <Button
                className="bg-orange-600 hover:bg-orange-700 rounded-xl w-full sm:w-auto"
                onClick={handleApplyCoupon}
                disabled={!!appliedCoupon}
              >
                {appliedCoupon ? "Applied" : "Apply"}
              </Button>
            </div>
            {couponError && <div className="text-red-500 text-sm">{couponError}</div>}
            {appliedCoupon && (
              <div className="flex flex-col sm:flex-row sm:justify-between text-green-600 font-semibold">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>-{appliedCoupon.type === "percent" ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`} ({`-$${discount.toFixed(2)}`})</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr className="border-orange-200" />
            <div className="flex flex-col sm:flex-row sm:justify-between font-bold text-lg gap-2">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            {/* Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl text-base py-3">
                  Proceed to Checkout
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-full w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto p-2 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <CreditCard className="h-6 w-6" />
                    Checkout
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Review your order and select delivery address
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Order Summary */}
                  <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex flex-col xs:flex-row justify-between items-center py-2 border-b border-orange-100 last:border-b-0 gap-2 xs:gap-0">
                          <div className="flex items-center gap-3 w-full xs:w-auto">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-gray-600">Size: {item.size} | Color: {item.color}</p>
                            </div>
                          </div>
                          <div className="text-right w-full xs:w-auto">
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {appliedCoupon && (
                        <div className="flex flex-col xs:flex-row justify-between text-green-600 font-semibold pt-2">
                          <span>Coupon ({appliedCoupon.code})</span>
                          <span>-{appliedCoupon.type === "percent" ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`} ({`-$${discount.toFixed(2)}`})</span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-orange-200">
                        <div className="flex flex-col xs:flex-row justify-between items-center gap-2 xs:gap-0">
                          <span className="font-semibold text-lg">Total</span>
                          <span className="font-bold text-xl text-orange-600">${grandTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Address Selection */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      Select Delivery Address
                    </h3>
                    <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-3">
                      {addresses.map((address) => (
                        <div key={address.id} className="relative">
                          <RadioGroupItem value={address.id} id={address.id} className="sr-only" />
                          <Label 
                            htmlFor={address.id} 
                            className="block cursor-pointer"
                          >
                            <div className={`bg-white rounded-xl p-4 border-2 transition-all duration-200 ${
                              selectedAddress === address.id 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                            }`}>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                                <div className="flex items-center gap-2">
                                  <Badge variant={address.isDefault ? "default" : "outline"} className="text-xs">
                                    {address.type}
                                  </Badge>
                                  {address.isDefault && (
                                    <Badge className="bg-green-500 text-white text-xs">Default</Badge>
                                  )}
                                </div>
                                {selectedAddress === address.id && (
                                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  </div>
                                )}
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-1">{address.name}</h4>
                              <p className="text-sm text-gray-600 mb-1">{address.address}</p>
                              <p className="text-sm text-gray-500">{address.phone}</p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setIsCheckoutOpen(false)}
                      className="flex-1 h-12 text-base"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      disabled={!selectedAddress}
                      className="flex-1 h-12 text-base bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CartAndWishlist
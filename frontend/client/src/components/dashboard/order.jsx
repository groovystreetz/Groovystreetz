import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCw, Package, Loader2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import axios from "axios"
import { getCookie } from "@/lib/csrf"

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // const token = localStorage.getItem('token')
      const csrfToken = getCookie('csrftoken');
      const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/orders/', {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      })
      setOrders(response.data)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500'
      case 'processing':
        return 'bg-blue-500'
      case 'shipped':
        return 'bg-purple-500'
      case 'delivered':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  if (loading) {
    return (
      <Card className="glassmorphism rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading orders...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glassmorphism rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchOrders} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(order.created_at)} • {getTotalItems(order.items)} items
                  </p>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  {order.status}
                </Badge>
              </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">₹{order.total_price}</span>
              <div className="flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl bg-transparent"
                      onClick={() => {
                        setSelectedOrder(order)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Order Details</SheetTitle>
                      <SheetDescription>
                        Details for Order #{selectedOrder?.id}
                      </SheetDescription>
                    </SheetHeader>
                    {selectedOrder && (
                      <div className="py-4 space-y-4">
                        <div>
                          <span className="font-semibold">Date:</span> {formatDate(selectedOrder.created_at)}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span>{" "}
                          <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                            {selectedOrder.status}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-semibold">Total:</span> ₹{selectedOrder.total_price}
                        </div>
                        <div>
                          <span className="font-semibold">Items:</span> {getTotalItems(selectedOrder.items)}
                        </div>
                        <div>
                          <span className="font-semibold">Shipping Address:</span>
                          <p className="text-sm text-gray-600 mt-1">{selectedOrder.shipping_address}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Order Items:</span>
                          <ul className="mt-2 space-y-4">
                            {selectedOrder.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-4 border-b pb-4">
                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">Product ID: {item.product}</div>
                                  <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                  <div className="font-semibold">₹{item.price}</div>
                                </div>
                                {selectedOrder.status === "delivered" && (
                                  <div className="flex flex-col gap-2">
                                    <Button variant="destructive" size="sm" className="rounded-xl">
                                      Return
                                    </Button>
                                    <Button variant="outline" size="sm" className="rounded-xl">
                                      Replace
                                    </Button>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {selectedOrder.status === "pending" && (
                          <div className="pt-4">
                            <Button variant="destructive" className="rounded-xl w-full">
                              Cancel Order
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
                <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reorder
                </Button>
              </div>
            </div>
          </div>
        ))
        )}
      </CardContent>
    </Card>
  )
}

export default OrderHistory
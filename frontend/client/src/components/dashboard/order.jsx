import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCw, Package } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { orders } from "@/lib/orders"

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  // const [open, setOpen] = useState(false)

  return (
    <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-sm text-gray-600">
                  {order.date} • {order.items} items
                </p>
              </div>
              <Badge className={`${order.statusColor} text-white`}>{order.status}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">${order.total}</span>
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
                          <span className="font-semibold">Date:</span> {selectedOrder.date}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span>{" "}
                          <Badge className={`${selectedOrder.statusColor} text-white`}>
                            {selectedOrder.status}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-semibold">Total:</span> ${selectedOrder.total}
                        </div>
                        <div>
                          <span className="font-semibold">Items:</span> {selectedOrder.items}
                        </div>
                        <div>
                          <span className="font-semibold">Products:</span>
                          <ul className="mt-2 space-y-4">
                            {selectedOrder.products.map((product, idx) => (
                              <li key={idx} className="flex items-center gap-4 border-b pb-4">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 rounded object-cover border"
                                />
                                <div className="flex-1">
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-xs text-gray-500">Qty: {product.qty}</div>
                                  <div className="font-semibold">${product.price}</div>
                                </div>
                                {selectedOrder.status === "Delivered" && (
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
                        {selectedOrder.status === "Processing" && (
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
        ))}
      </CardContent>
    </Card>
  )
}

export default OrderHistory
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, RotateCcw } from "lucide-react"
import { orders } from "@/lib/orders"

const recentRequests = [
  {
    id: "RET001",
    orderId: "GS001230",
    status: "Approved",
    date: "Dec 18, 2024",
    statusColor: "bg-green-500",
  },
  {
    id: "RET002",
    orderId: "GS001228",
    status: "In Review",
    date: "Dec 16, 2024",
    statusColor: "bg-orange-500",
  },
]

const ReturnsAndReplacements = () => {
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const selectedOrder = orders.find(o => o.id === selectedOrderId)

  return (
    <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Returns & Replacements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 rounded-xl">
              Request Return/Replace
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Return/Replace Request</DialogTitle>
              <DialogDescription>
                Fill out the form below to request a return or replacement
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="order-id">Order</Label>
                <Select value={selectedOrderId} onValueChange={value => { setSelectedOrderId(value); setSelectedProduct("") }}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map(order => (
                      <SelectItem key={order.id} value={order.id}>
                        Order #{order.id} ({order.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedOrder && (
                <div>
                  <Label htmlFor="product">Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedOrder.products.map((product, idx) => (
                        <SelectItem key={product.name + idx} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defective">Defective Product</SelectItem>
                    <SelectItem value="wrong-size">Wrong Size</SelectItem>
                    <SelectItem value="not-as-described">Not as Described</SelectItem>
                    <SelectItem value="damaged">Damaged in Transit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the issue..." className="rounded-xl" />
              </div>
              <div>
                <Label>Upload Images (Optional)</Label>
                <div className="border-2 border-dashed border-orange-300 rounded-xl p-4 text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload images</p>
                </div>
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl">
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          <h3 className="font-semibold">Recent Requests</h3>
          {recentRequests.map((request) => (
            <div key={request.id} className="bg-white/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Request #{request.id}</h4>
                  <p className="text-sm text-gray-600">
                    Order: {request.orderId} • {request.date}
                  </p>
                </div>
                <Badge className={`${request.statusColor} text-white`}>{request.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ReturnsAndReplacements
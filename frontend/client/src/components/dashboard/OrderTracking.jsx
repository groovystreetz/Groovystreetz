import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, CheckCircle, Truck } from "lucide-react"
import { orders } from "@/lib/orders"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select"

const trackingSteps = [
  { label: "Order Confirmed", icon: CheckCircle, key: "Confirmed" },
  { label: "Shipped", icon: CheckCircle, key: "Shipped" },
  { label: "Out for Delivery", icon: Truck, key: "OutForDelivery" },
  { label: "Delivered", icon: CheckCircle, key: "Delivered" },
]

const statusToStep = {
  "Processing": 0,
  "In Transit": 2,
  "Delivered": 3,
}

const OrderTracking = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || "")
  const selectedOrder = orders.find(o => o.id === selectedOrderId)
  const currentStep = statusToStep[selectedOrder?.status] ?? 0

  return (
    <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Track Your Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-center">
          <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
            <SelectTrigger className="rounded-xl w-64">
              <SelectValue placeholder="Select an order to track" />
            </SelectTrigger>
            <SelectContent>
              {orders.map(order => (
                <SelectItem key={order.id} value={order.id}>
                  Order #{order.id} ({order.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedOrder && (
          <div className="bg-white/30 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">Order #{selectedOrder.id}</h3>
                <p className="text-sm text-gray-600">Date: {selectedOrder.date}</p>
              </div>
              <Badge className={`${selectedOrder.statusColor} text-white`}>
                {selectedOrder.status}
              </Badge>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-6">
              {trackingSteps.map((step, idx) => {
                const Icon = step.icon
                const isActive = idx <= currentStep
                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${isActive ? (idx === 2 ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-300'}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className={`text-xs ${isActive ? 'font-semibold' : 'text-gray-400'}`}>{step.label}</span>
                    {idx < trackingSteps.length - 1 && (
                      <div className={`h-1 w-full ${isActive && idx < currentStep ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Location/Status */}
            <div className="mt-6 pt-4 border-t border-orange-200">
              <div className="flex justify-between items-center">
                <span>Current Status: <b>{selectedOrder.status}</b></span>
                <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                  <Download className="h-4 w-4 mr-1" />
                  Download Invoice
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OrderTracking
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"

const availableCoupons = [
  { code: "GROOVY20", discount: "20% OFF", expires: "Dec 31, 2024" },
  { code: "FIRST15", discount: "15% OFF", expires: "Jan 15, 2025" },
]

const OffersAndRewards = () => (
  <div className="grid lg:grid-cols-2 gap-6">
    {/* Reward Points */}
    <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Reward Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-orange-600 mb-2">1,250</div>
          <p className="text-gray-600">Available Points</p>
          <p className="text-sm text-gray-500 mt-2">= $12.50 in rewards</p>
        </div>
        <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl">
          Redeem Points
        </Button>
      </CardContent>
    </Card>

    {/* Available Coupons */}
    <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <CardTitle>Available Coupons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableCoupons.map((coupon) => (
          <div key={coupon.code} className="bg-white/30 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{coupon.code}</h4>
                <p className="text-sm text-gray-600">Expires: {coupon.expires}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange-600">{coupon.discount}</div>
                <Button size="sm" variant="outline" className="rounded-xl mt-1 bg-transparent">
                  Copy Code
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
)

export default OffersAndRewards
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Plus, CreditCard } from "lucide-react"

const paymentHistory = [
  {
    id: "PAY001",
    amount: 154,
    method: "Credit Card",
    date: "Dec 15, 2024",
    status: "Completed",
  },
  {
    id: "PAY002",
    amount: 89,
    method: "UPI",
    date: "Dec 20, 2024",
    status: "Completed",
  },
]

const PaymentsAndRefunds = () => (
  <div className="grid lg:grid-cols-1 gap-6">
    {/* Payment History */}
    <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentHistory.map((payment) => (
          <div key={payment.id} className="bg-white/30 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">${payment.amount}</h4>
                <p className="text-sm text-gray-600">
                  {payment.method} • {payment.date}
                </p>
              </div>
              <Badge className="bg-green-500 text-white">{payment.status}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Saved Payment Methods */}
    {/* <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <CardTitle>Saved Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white/30 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">•••• •••• •••• 1234</h4>
              <p className="text-sm text-gray-600">Expires 12/26</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button variant="outline" className="w-full rounded-xl bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Add New Card
        </Button>
      </CardContent>
    </Card> */}
  </div>
)

export default PaymentsAndRefunds
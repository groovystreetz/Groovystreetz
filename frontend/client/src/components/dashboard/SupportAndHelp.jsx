import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Phone, Mail } from "lucide-react"

const SupportAndHelp = () => (
  <>
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Get Help */}
      <Card className="glassmorphism rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Get Help
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full justify-start bg-green-600 hover:bg-green-700 rounded-xl">
            <MessageCircle className="h-4 w-4 mr-2" />
            Live Chat Support
          </Button>
          <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
            <Phone className="h-4 w-4 mr-2" />
            Call Support: +1 800-GROOVY
          </Button>
          <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
            <Mail className="h-4 w-4 mr-2" />
            Email: support@groovystreetz.com
          </Button>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="glassmorphism rounded-2xl">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start rounded-xl">
            Size Guide
          </Button>
          <Button variant="ghost" className="w-full justify-start rounded-xl">
            Return & Refund Policy
          </Button>
          <Button variant="ghost" className="w-full justify-start rounded-xl">
            Shipping Information
          </Button>
          <Button variant="ghost" className="w-full justify-start rounded-xl">
            FAQ
          </Button>
          <Button variant="ghost" className="w-full justify-start rounded-xl">
            Privacy Policy
          </Button>
        </CardContent>
      </Card>
    </div>

    {/* Raise a Ticket */}
    <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <CardTitle>Raise a Ticket</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="Brief description of your issue" className="rounded-xl" />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order">Order Issue</SelectItem>
              <SelectItem value="payment">Payment Problem</SelectItem>
              <SelectItem value="product">Product Quality</SelectItem>
              <SelectItem value="shipping">Shipping Delay</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Describe your issue in detail..."
            className="rounded-xl"
            rows={4}
          />
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 rounded-xl">Submit Ticket</Button>
      </CardContent>
    </Card>
  </>
)

export default SupportAndHelp
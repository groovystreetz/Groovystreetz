import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MapPin, Edit, Trash2 } from "lucide-react"

const addresses = [
  {
    id: 1,
    type: "Home",
    name: "John Doe",
    address: "123 Street Name, City, State 12345",
    phone: "+1 234-567-8900",
    isDefault: true,
  },
  {
    id: 2,
    type: "Office",
    name: "John Doe",
    address: "456 Office Building, Business District, State 12345",
    phone: "+1 234-567-8900",
    isDefault: false,
  },
]

const AddressManagement = () => (
  <Card className="glassmorphism rounded-2xl">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Saved Addresses
        </CardTitle>
        <Sheet>
          <SheetTrigger >
            <Button className="bg-orange-600 hover:bg-orange-700 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add New Address</SheetTitle>
              <SheetDescription>Fill in the details for your new address</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="address-type">Address Type</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" className="rounded-xl" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="address1">Address Line 1</Label>
                <Input id="address1" className="rounded-xl" placeholder="Street address, P.O. box, company name" />
              </div>
              <div>
                <Label htmlFor="address2">Address Line 2</Label>
                <Input id="address2" className="rounded-xl" placeholder="Apartment, suite, unit, building, floor, etc." />
              </div>
              <div>
                <Label htmlFor="landmark">Landmark</Label>
                <Input id="landmark" className="rounded-xl" placeholder="Nearby landmark for easy location" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" className="rounded-xl" placeholder="City name" />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" className="rounded-xl" placeholder="State or province" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">ZIP/Postal Code</Label>
                  <Input id="zip" className="rounded-xl" placeholder="ZIP or postal code" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger id="country" className="rounded-xl">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" className="rounded-xl" placeholder="Region or territory" />
                </div>
                {/* <div>
                  <Label htmlFor="county">County</Label>
                  <Input id="county" className="rounded-xl" placeholder="County name" />
                </div> */}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone-address">Phone Number</Label>
                  <Input id="phone-address" className="rounded-xl" placeholder="+1 (234) 567-8900" />
                </div>
                <div>
                  <Label htmlFor="alt-phone">Alternative Phone</Label>
                  <Input id="alt-phone" className="rounded-xl" placeholder="Alternative contact number" />
                </div>
              </div>
              <div>
                <Label htmlFor="delivery-instructions">Delivery Instructions</Label>
                <Textarea 
                  id="delivery-instructions" 
                  className="rounded-xl" 
                  placeholder="Special instructions for delivery (Optional)"
                  rows={3}
                />
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl">Save Address</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {addresses.map((address) => (
        <div key={address.id} className="bg-white/30 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={address.isDefault ? "default" : "outline"}>{address.type}</Badge>
                {address.isDefault && <Badge className="bg-green-500 text-white">Default</Badge>}
              </div>
              <h4 className="font-semibold">{address.name}</h4>
              <p className="text-sm text-gray-600 mb-1">{address.address}</p>
              <p className="text-sm text-gray-600">{address.phone}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl text-red-500 bg-transparent">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
)

export default AddressManagement
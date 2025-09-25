import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MapPin, Edit, Trash2, Loader2 } from "lucide-react"
import { useAddresses } from "@/hooks/useAddresses"

const AddressManagement = () => {
  const { 
    createAddress, 
    getAddresses, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress, 
    loading, 
    // error 
  } = useAddresses();

  const [addresses, setAddresses] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    region: '',
    phone: '',
    alt_phone: '',
    delivery_instructions: '',
    is_default: false
  });

  // Load addresses on component mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await createAddress(formData);
      }
      await loadAddresses();
      setIsSheetOpen(false);
      setEditingAddress(null);
      resetForm();
    } catch (err) {
      console.error('Failed to save address:', err);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type || '',
      name: address.name || '',
      address_line_1: address.address_line_1 || '',
      address_line_2: address.address_line_2 || '',
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || '',
      region: address.region || '',
      phone: address.phone || '',
      alt_phone: address.alt_phone || '',
      delivery_instructions: address.delivery_instructions || '',
      is_default: address.is_default || false
    });
    setIsSheetOpen(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        await loadAddresses();
      } catch (err) {
        console.error('Failed to delete address:', err);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      await loadAddresses();
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      name: '',
      address_line_1: '',
      address_line_2: '',
      landmark: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      region: '',
      phone: '',
      alt_phone: '',
      delivery_instructions: '',
      is_default: false
    });
  };

  const openAddSheet = () => {
    setEditingAddress(null);
    resetForm();
    setIsSheetOpen(true);
  };

  return (
    <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Saved Addresses
          </CardTitle>
          <Button 
            onClick={openAddSheet}
            className="bg-orange-600 hover:bg-orange-700 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && addresses.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading addresses...</span>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No addresses found. Add your first address to get started.
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-white/30 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {/* <Badge variant={address.is_default ? "default" : "outline"}>
                      {address.type}
                    </Badge> */}
                    {address.is_default && (
                      <Badge className="bg-green-500 text-white">Default</Badge>
                    )}
                  </div>
                  <h4 className="font-semibold">{address.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {[address.address_line_1, address.address_line_2, address.city, address.state, address.postal_code]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl bg-transparent"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!address.is_default && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl bg-transparent"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl text-red-500 bg-transparent"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </SheetTitle>
            <SheetDescription>
              {editingAddress ? 'Update your address details' : 'Fill in the details for your new address'}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="address-type">Address Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleInputChange('type', value)}
              >
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
              <Input 
                id="full-name" 
                className="rounded-xl" 
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="address1">Address Line 1</Label>
              <Input 
                id="address1" 
                className="rounded-xl" 
                placeholder="Street address, P.O. box, company name"
                value={formData.address_line_1}
                onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="address2">Address Line 2</Label>
              <Input 
                id="address2" 
                className="rounded-xl" 
                placeholder="Apartment, suite, unit, building, floor, etc."
                value={formData.address_line_2}
                onChange={(e) => handleInputChange('address_line_2', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="landmark">Landmark</Label>
              <Input 
                id="landmark" 
                className="rounded-xl" 
                placeholder="Nearby landmark for easy location"
                value={formData.landmark}
                onChange={(e) => handleInputChange('landmark', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  className="rounded-xl" 
                  placeholder="City name"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input 
                  id="state" 
                  className="rounded-xl" 
                  placeholder="State or province"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip">ZIP/Postal Code</Label>
                <Input 
                  id="zip" 
                  className="rounded-xl" 
                  placeholder="ZIP or postal code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => handleInputChange('country', value)}
                >
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
                <Input 
                  id="region" 
                  className="rounded-xl" 
                  placeholder="Region or territory"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone-address">Phone Number</Label>
                <Input 
                  id="phone-address" 
                  className="rounded-xl" 
                  placeholder="+1 (234) 567-8900"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="alt-phone">Alternative Phone</Label>
                <Input 
                  id="alt-phone" 
                  className="rounded-xl" 
                  placeholder="Alternative contact number"
                  value={formData.alt_phone}
                  onChange={(e) => handleInputChange('alt_phone', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="delivery-instructions">Delivery Instructions</Label>
              <Textarea 
                id="delivery-instructions" 
                className="rounded-xl" 
                placeholder="Special instructions for delivery (Optional)"
                rows={3}
                value={formData.delivery_instructions}
                onChange={(e) => handleInputChange('delivery_instructions', e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingAddress ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                editingAddress ? 'Update Address' : 'Save Address'
              )}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </Card>
  );
};

export default AddressManagement
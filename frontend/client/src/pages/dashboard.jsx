import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ShoppingCart,
  Heart,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  MapPin,
  Gift,
  MessageCircle,
  Plus,
  Minus,
  Trash2,
  Download,
  Camera,
  CheckCircle,
  Phone,
  Mail,
  Edit,
  Eye,
  RefreshCw,
  Menu,
} from "lucide-react"
import CartAndWishlist from "@/components/dashboard/CartAndWishlist"
import OrderHistory from "@/components/dashboard/order"
import OrderTracking from "@/components/dashboard/OrderTracking"
import ReturnsAndReplacements from "@/components/dashboard/ReturnAndReplacement"
import PaymentsAndRefunds from "@/components/dashboard/PaymentsAndRefunds"
import ProfileManagement from "@/components/dashboard/ProfileManagement"
import AddressManagement from "@/components/dashboard/AddressManagement"
import OffersAndRewards from "@/components/dashboard/OffersAndRewards"
import SupportAndHelp from "@/components/dashboard/SupportAndHelp"
import { useIsMobile } from "@/hooks/use-mobile"

const NAV_ITEMS = [
  // { key: "cart", label: "Cart", icon: ShoppingCart },
  { key: "orders", label: "Orders", icon: Package },
  { key: "tracking", label: "Tracking", icon: Truck },
  { key: "returns", label: "Returns", icon: RotateCcw },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "profile", label: "Profile", icon: User },
  { key: "rewards", label: "Rewards", icon: Gift },
  { key: "support", label: "Support", icon: MessageCircle },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("cart")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()

  // Section rendering for mobile
  const renderSection = (tab) => {
    switch (tab) {
      // case "cart":
      //   return <CartAndWishlist />
      case "orders":
        return <OrderHistory />
      case "tracking":
        return <OrderTracking />
      case "returns":
        return <ReturnsAndReplacements />
      case "payments":
        return <PaymentsAndRefunds />
      case "profile":
        return <>
          <ProfileManagement />
          <AddressManagement />
        </>
      case "rewards":
        return <OffersAndRewards />
      case "support":
        return <SupportAndHelp />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden mx-auto w-full bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="mx-auto w-full container">
        {!isMobile && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your orders, profile, and preferences</p>
          </div>
        )}

        {isMobile ? (
          <>
            {/* Top bar with hamburger */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <span className="font-bold text-lg">{NAV_ITEMS.find(i => i.key === activeTab)?.label}</span>
              <div style={{ width: 40 }} /> {/* Spacer for symmetry */}
            </div>
            {/* Sidebar navigation */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetContent side="left" className="p-0 w-64">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col">
                  {NAV_ITEMS.map(item => (
                    <Button
                      key={item.key}
                      variant={activeTab === item.key ? "secondary" : "ghost"}
                      className="justify-start rounded-none px-6 py-4 text-base border-b"
                      onClick={() => {
                        setActiveTab(item.key)
                        setSidebarOpen(false)
                      }}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="mt-4">{renderSection(activeTab)}</div>
          </>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8 bg-white/50 backdrop-blur-sm rounded-2xl p-1">
              {NAV_ITEMS.map(item => (
                <TabsTrigger key={item.key} value={item.key} className="flex items-center gap-2 rounded-xl">
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {/* Tab contents */}
            {/* <TabsContent value="cart" className="space-y-6">
              <CartAndWishlist />
            </TabsContent> */}
            <TabsContent value="orders" className="space-y-6">
              <OrderHistory />
            </TabsContent>
            <TabsContent value="tracking" className="space-y-6">
              <OrderTracking />
            </TabsContent>
            <TabsContent value="returns" className="space-y-6">
              <ReturnsAndReplacements />
            </TabsContent>
            <TabsContent value="payments" className="space-y-6">
              <PaymentsAndRefunds />
            </TabsContent>
            <TabsContent value="profile" className="space-y-6">
              <ProfileManagement />
              <AddressManagement />
            </TabsContent>
            <TabsContent value="rewards" className="space-y-6">
              <OffersAndRewards />
            </TabsContent>
            <TabsContent value="support" className="space-y-6">
              <SupportAndHelp />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

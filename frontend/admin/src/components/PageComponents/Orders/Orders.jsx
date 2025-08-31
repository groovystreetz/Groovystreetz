import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Package,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  User,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { getCookie } from "@/lib/csrf";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check all cookies
      console.log('All cookies:', document.cookie);
      
      const csrfToken = getCookie('csrftoken');
      const token = localStorage.getItem('admin_token');
      
      console.log('Fetching orders with:');
      console.log('CSRF Token:', csrfToken);
      console.log('Admin Token:', token);
      console.log('User info from localStorage:', localStorage.getItem('admin_user_info'));
      
      const headers = {
        'X-CSRFToken': csrfToken,
      };
      
      // Add Authorization header if we have a token
      if (token && token !== 'dummy') {
        headers['Authorization'] = `Token ${token}`;
      }
      
      console.log('Request headers:', headers);
      console.log('Request URL:', 'http://localhost:8000/api/admin/orders/');
      
      const response = await axios.get('http://localhost:8000/api/admin/orders/', {
        withCredentials: true,
        headers: headers,
      });
      
      console.log('Orders response:', response.data);
      setOrders(response.data);
      setFilteredOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(`Failed to fetch orders: ${err.response?.data?.detail || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch product details by ID
  const fetchProductDetails = async (productId) => {
    try {
      setLoadingProducts(true);
      const csrfToken = getCookie('csrftoken');
      const token = localStorage.getItem('admin_token');
      
      const headers = {
        'X-CSRFToken': csrfToken,
      };
      
      if (token && token !== 'dummy') {
        headers['Authorization'] = `Token ${token}`;
      }
      
      console.log('Fetching product details for ID:', productId);
      const response = await axios.get(`http://localhost:8000/api/products/${productId}`, {
        withCredentials: true,
        headers: headers,
      });
      
      console.log('Product details response:', response.data);
      setProductDetails(prev => ({
        ...prev,
        [productId]: response.data
      }));
    } catch (err) {
      console.error('Error fetching product details:', err);
      // Set a placeholder for failed product fetches
      setProductDetails(prev => ({
        ...prev,
        [productId]: { error: 'Failed to load product details' }
      }));
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch all product details for an order when sheet opens
  const handleOrderDetailsOpen = async (order) => {
    setSelectedOrder(order);
    
    // Fetch product details for all items in the order
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        if (item.product && !productDetails[item.product]) {
          fetchProductDetails(item.product);
        }
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders;
    
    if (searchTerm) {
              filtered = filtered.filter(order => 
          order.id?.toString().includes(searchTerm) ||
          order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.status?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, selectedStatus, orders]);

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchOrders} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Order Management</h1>
        <p className="text-muted-foreground text-lg">
          Monitor and manage all platform orders with comprehensive tools and insights.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="text-sidebar-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status?.toLowerCase() === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status?.toLowerCase() === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status?.toLowerCase() === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From all orders
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                View and manage all platform orders
              </CardDescription>
            </div>
            <Button variant="outline" onClick={fetchOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by ID, customer, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sidebar-primary"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium">Shipping Address</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Total</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">#{order.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {order.shipping_address || 'No address'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={getStatusBadgeVariant(order.status)}
                        className={getStatusColor(order.status)}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status || 'Unknown'}</span>
                        </div>
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          ${order.total_price || order.total || '0.00'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOrderDetailsOpen(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Order Details</SheetTitle>
                              <SheetDescription>
                                Complete information for Order #{order.id}
                              </SheetDescription>
                            </SheetHeader>
                            
                            <div className="mt-6 space-y-6">
                              {/* Order Status */}
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h3 className="font-medium">Order Status</h3>
                                  <p className="text-sm text-gray-600">Current order status</p>
                                </div>
                                <Badge 
                                  variant={getStatusBadgeVariant(order.status)}
                                  className={getStatusColor(order.status)}
                                >
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(order.status)}
                                    <span className="capitalize">{order.status || 'Unknown'}</span>
                                  </div>
                                </Badge>
                              </div>
                              
                              {/* Order Summary */}
                              <div className="space-y-4">
                                <h4 className="font-medium text-lg">Order Summary</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Order ID</label>
                                    <p className="text-sm font-semibold">#{order.id}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Order Date</label>
                                    <p className="text-sm">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Original Price</label>
                                    <p className="text-sm">${order.original_price || '0.00'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Discount</label>
                                    <p className="text-sm">${order.discount_amount || '0.00'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Discount %</label>
                                    <p className="text-sm">{order.discount_percentage || '0'}%</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Final Total</label>
                                    <p className="text-sm font-semibold text-green-600">${order.total_price || order.total || '0.00'}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Shipping Information */}
                              <div className="space-y-4">
                                <h4 className="font-medium text-lg">Shipping Information</h4>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-600">
                                    {order.shipping_address || 'No shipping address provided'}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Order Items */}
                              <div className="space-y-4">
                                <h4 className="font-medium text-lg">Order Items</h4>
                                {order.items && order.items.length > 0 ? (
                                  <div className="space-y-3">
                                    {order.items.map((item, index) => {
                                      const productDetail = productDetails[item.product];
                                      return (
                                        <div key={index} className="p-3 bg-white rounded-lg border">
                                          <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                              {loadingProducts ? (
                                                <div className="flex items-center space-x-2">
                                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                                  <span className="text-sm text-gray-500">Loading product details...</span>
                                                </div>
                                              ) : productDetail?.error ? (
                                                <div className="text-sm text-red-500">
                                                  {productDetail.error}
                                                </div>
                                                                                             ) : productDetail ? (
                                                 <div className="flex items-start space-x-3">
                                                   {productDetail.image && (
                                                     <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                       <img 
                                                         src={productDetail.image} 
                                                         alt={productDetail.name}
                                                         className="w-full h-full object-cover"
                                                         onError={(e) => {
                                                           e.target.style.display = 'none';
                                                           e.target.nextSibling.style.display = 'flex';
                                                         }}
                                                       />
                                                       <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                         <Package className="h-6 w-6" />
                                                       </div>
                                                     </div>
                                                   )}
                                                   <div className="flex-1">
                                                     <span className="font-medium">{productDetail.name || `Product ${item.product}`}</span>
                                                     {productDetail.description && (
                                                       <p className="text-xs text-gray-600 mt-1">{productDetail.description}</p>
                                                     )}
                                                     <div className="flex items-center space-x-4 mt-2 text-xs">
                                                       {productDetail.category && (
                                                         <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                           {productDetail.category}
                                                         </span>
                                                       )}
                                                       {productDetail.stock !== undefined && (
                                                         <span className={`px-2 py-1 rounded-full ${
                                                           productDetail.stock > 10 
                                                             ? 'bg-green-100 text-green-800' 
                                                             : productDetail.stock > 0 
                                                             ? 'bg-yellow-100 text-yellow-800'
                                                             : 'bg-red-100 text-red-800'
                                                         }`}>
                                                           Stock: {productDetail.stock}
                                                         </span>
                                                       )}
                                                     </div>
                                                   </div>
                                                 </div>
                                              ) : (
                                                <span className="font-medium">Product {item.product}</span>
                                              )}
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm">
                                              <span className="text-gray-600">Qty: {item.quantity}</span>
                                              <span className="font-medium">${item.price}</span>
                                            </div>
                                          </div>
                                                                                     {productDetail && !productDetail.error && (
                                             <div className="text-xs text-gray-500 space-y-1">
                                               <div>Product ID: {item.product}</div>
                                               {productDetail.price && (
                                                 <div className="flex items-center space-x-2">
                                                   <span>Current Price: ${productDetail.price}</span>
                                                   {parseFloat(productDetail.price) !== parseFloat(item.price) && (
                                                     <span className={`px-2 py-1 rounded-full text-xs ${
                                                       parseFloat(productDetail.price) > parseFloat(item.price)
                                                         ? 'bg-red-100 text-red-800'
                                                         : 'bg-green-100 text-green-800'
                                                     }`}>
                                                       {parseFloat(productDetail.price) > parseFloat(item.price) ? 'Price ↑' : 'Price ↓'}
                                                     </span>
                                                   )}
                                                 </div>
                                               )}
                                             </div>
                                           )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    No items found for this order
                                  </div>
                                )}
                              </div>
                              
                              {/* Additional Details */}
                              <div className="space-y-4">
                                <h4 className="font-medium text-lg">Additional Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <label className="font-medium text-gray-500">No Returns Allowed</label>
                                    <p>{order.no_return_allowed ? 'Yes' : 'No'}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium text-gray-500">Last Updated</label>
                                    <p>{order.updated_at ? new Date(order.updated_at).toLocaleDateString() : 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-4 border-t">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSelectedOrder(null)}
                                  className="flex-1"
                                >
                                  Close
                                </Button>
                                <Button className="flex-1">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Order
                                </Button>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {orders.length === 0 ? 'No orders found.' : 'No orders match your search criteria.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
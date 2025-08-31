import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Plus,
  RefreshCw,
  Save,
  X,
  Edit,
  Trash2,
  Search,
  Image as ImageIcon,
  Package,
  DollarSign,
  Boxes,
  Eye,
} from "lucide-react";
import axios from "axios";
import { getCookie } from "@/lib/csrf";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image: null,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const headers = useMemo(() => {
    const csrfToken = getCookie("csrftoken");
    const token = localStorage.getItem("admin_token");
    const h = { "X-CSRFToken": csrfToken };
    if (token && token !== "dummy") {
      h["Authorization"] = `Token ${token}`;
    }
    return h;
  }, []);

  const BASE_URL = "http://localhost:8000";

  async function loadAll() {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/api/admin/products/`, {
        withCredentials: true,
        headers,
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Load products failed", err);
      setError(
        err?.response?.data?.detail || "Failed to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const q = searchTerm.toLowerCase();
    return products.filter((p) =>
      [p.name, p.description, String(p.price), String(p.stock)].some((v) =>
        String(v ?? "").toLowerCase().includes(q)
      )
    );
  }, [products, searchTerm]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((f) => ({ ...f, image: files && files[0] ? files[0] : null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || product.category_id || "",
      stock: String(product.stock ?? ""),
      image: null, // keep empty; only send if new file selected
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  async function submitForm(e) {
    e?.preventDefault?.();
    try {
      setSaving(true);
      setError(null);
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price || "0");
      if (form.category !== "") data.append("category", form.category);
      if (form.stock !== "") data.append("stock", form.stock);
      if (form.image) data.append("image", form.image);

      if (editingId) {
        await axios.put(`${BASE_URL}/api/admin/products/${editingId}/`, data, {
          withCredentials: true,
          headers, // don't set content-type; browser will set boundary
        });
      } else {
        await axios.post(`${BASE_URL}/api/admin/products/`, data, {
          withCredentials: true,
          headers,
        });
      }
      await loadAll();
      closeForm();
    } catch (err) {
      console.error("Save product failed", err);
      setError(
        err?.response?.data?.detail || "Failed to save product. Please check inputs."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/products/${id}/`, {
        withCredentials: true,
        headers,
      });
      await loadAll();
    } catch (err) {
      console.error("Delete product failed", err);
      setError(err?.response?.data?.detail || "Failed to delete product.");
    }
  }

  // Get current product for image preview in edit mode
  const currentProduct = editingId ? products.find(p => p.id === editingId) : null;
  const imagePreview = form.image ? URL.createObjectURL(form.image) : (currentProduct?.image || null);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Product Management</h1>
        <p className="text-muted-foreground text-lg">
          Create, update, and manage all products.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="text-sidebar-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Catalog size</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Stock (Items)</CardTitle>
            <Boxes className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.reduce((s,p)=>s + (Number(p.stock)||0),0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Sum of stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <DollarSign className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${products.length ? (products.reduce((s,p)=>s + (Number(p.price)||0),0)/products.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across catalog</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Create / Edit Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Product" : "Create Product"}</SheetTitle>
            <SheetDescription>
              {editingId ? `Editing ID #${editingId}` : "Fill details then save"}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <form onSubmit={submitForm} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Enter product name" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  placeholder="Enter product description" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input 
                    name="price" 
                    value={form.price} 
                    onChange={handleChange} 
                    placeholder="29.99" 
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input 
                    name="stock" 
                    value={form.stock} 
                    onChange={handleChange} 
                    placeholder="100" 
                    type="number"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category ID</label>
                <Input 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange} 
                  placeholder="Enter category ID" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Image</label>
                <div className="flex items-center gap-3">
                  <input 
                    name="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3">
                    <label className="text-sm font-medium text-gray-500">Preview:</label>
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-32 w-32 object-cover rounded-lg border"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={saving} 
                  className="flex-1 bg-sidebar-primary hover:bg-sidebar-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeForm}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Products list */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Products</CardTitle>
              <CardDescription>List, filter and manage your products</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search by name, description..." className="pl-10" />
              </div>
              <Button onClick={startCreate}>
                <Plus className="h-4 w-4 mr-2" /> New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">ID</th>
                  <th className="text-left py-3 px-4 font-medium">Image</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Price</th>
                  <th className="text-left py-3 px-4 font-medium">Stock</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#{p.id}</td>
                    <td className="py-3 px-4">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="h-10 w-10 object-cover rounded" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">No img</div>
                      )}
                    </td>
                    <td className="py-3 px-4">{p.name}</td>
                    <td className="py-3 px-4">${p.price}</td>
                    <td className="py-3 px-4">{p.stock}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedProduct(p)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                              <SheetTitle>Product Details</SheetTitle>
                              <SheetDescription>
                                Complete information for {p.name}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                              {/* Product Image */}
                              <div className="flex justify-center">
                                {p.image ? (
                                  <img 
                                    src={p.image} 
                                    alt={p.name} 
                                    className="h-48 w-48 object-cover rounded-lg shadow-md" 
                                  />
                                ) : (
                                  <div className="h-48 w-48 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                                    <ImageIcon className="h-16 w-16" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Info */}
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-lg font-semibold">{p.name}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Product ID</label>
                                    <p className="text-sm">#{p.id}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Category</label>
                                    <p className="text-sm">{p.category || p.category_id || 'Not specified'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Price</label>
                                    <p className="text-sm font-semibold text-green-600">${p.price}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Stock</label>
                                    <p className="text-sm">{p.stock} units</p>
                                  </div>
                                </div>
                                
                                {/* Additional Details */}
                                <div className="pt-4 border-t">
                                  <h4 className="font-medium mb-2">Additional Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Created:</span>
                                      <span>{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Updated:</span>
                                      <span>{p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Status:</span>
                                      <Badge variant={p.is_active ? 'default' : 'secondary'}>
                                        {p.is_active ? 'Active' : 'Inactive'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-4 border-t">
                                <Button 
                                  onClick={() => {
                                    setSelectedProduct(null);
                                    startEdit(p);
                                  }}
                                  className="flex-1"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Product
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSelectedProduct(null)}
                                  className="flex-1"
                                >
                                  Close
                                </Button>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(p)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteProduct(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">No products found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

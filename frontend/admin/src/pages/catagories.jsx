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
  Tag,
  Hash,
  Eye,
} from "lucide-react";
import axios from "axios";
import { getCookie } from "@/lib/csrf";

const emptyForm = {
  name: "",
  slug: "",
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
      const res = await axios.get(`${BASE_URL}/api/categories/`, {
        withCredentials: true,
        headers,
      });
      setCategories(res.data || []);
    } catch (err) {
      console.error("Load categories failed", err);
      setError(
        err?.response?.data?.detail || "Failed to load categories. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const q = searchTerm.toLowerCase();
    return categories.filter((c) =>
      [c.name, c.slug, String(c.id)].some((v) =>
        String(v ?? "").toLowerCase().includes(q)
      )
    );
  }, [categories, searchTerm]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function startEdit(category) {
    setEditingId(category.id);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
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
      const data = {
        name: form.name,
        slug: form.slug,
      };

      if (editingId) {
        await axios.put(`${BASE_URL}/api/categories/${editingId}/`, data, {
          withCredentials: true,
          headers,
        });
      } else {
        await axios.post(`${BASE_URL}/api/categories/`, data, {
          withCredentials: true,
          headers,
        });
      }
      await loadAll();
      closeForm();
    } catch (err) {
      console.error("Save category failed", err);
      setError(
        err?.response?.data?.detail || "Failed to save category. Please check inputs."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(id) {
    if (!confirm("Delete this category?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/categories/${id}/`, {
        withCredentials: true,
        headers,
      });
      await loadAll();
    } catch (err) {
      console.error("Delete category failed", err);
      setError(err?.response?.data?.detail || "Failed to delete category.");
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading categories...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Category Management</h1>
        <p className="text-muted-foreground text-lg">
          Create, update, and manage all product categories.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="text-sidebar-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Latest Category</CardTitle>
            <Hash className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0 ? categories[categories.length - 1].name : 'None'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Most recently added</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Tag className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((total, cat) => total + (cat.product_count || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Create / Edit Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Category" : "Create Category"}</SheetTitle>
            <SheetDescription>
              {editingId ? `Editing ID #${editingId}` : "Fill details then save"}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <form onSubmit={submitForm} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <Input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Enter category name" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input 
                  name="slug" 
                  value={form.slug} 
                  onChange={handleChange} 
                  placeholder="Enter category slug (e.g., t-shirts)" 
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The slug is used in URLs and should be lowercase with hyphens
                </p>
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

      {/* Categories list */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Categories</CardTitle>
              <CardDescription>List, filter and manage your product categories</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Search by name, slug..." 
                  className="pl-10" 
                />
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
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Slug</th>
                  <th className="text-left py-3 px-4 font-medium">Products</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#{c.id}</td>
                    <td className="py-3 px-4 font-medium">{c.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {c.slug}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {c.product_count ? (
                        <Badge variant="outline">{c.product_count} products</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedCategory(c)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                              <SheetTitle>Category Details</SheetTitle>
                              <SheetDescription>
                                Complete information for {c.name}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                              {/* Category Info */}
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-lg font-semibold">{c.name}</h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Category ID: #{c.id}
                                  </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Slug</label>
                                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                                      {c.slug}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Products</label>
                                    <p className="text-sm">
                                      {c.product_count ? `${c.product_count} products` : 'No products'}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Additional Details */}
                                <div className="pt-4 border-t">
                                  <h4 className="font-medium mb-2">Additional Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Created:</span>
                                      <span>{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Updated:</span>
                                      <span>{c.updated_at ? new Date(c.updated_at).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Status:</span>
                                      <Badge variant={c.is_active !== false ? 'default' : 'secondary'}>
                                        {c.is_active !== false ? 'Active' : 'Inactive'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-4 border-t">
                                <Button 
                                  onClick={() => {
                                    setSelectedCategory(null);
                                    startEdit(c);
                                  }}
                                  className="flex-1"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Category
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSelectedCategory(null)}
                                  className="flex-1"
                                >
                                  Close
                                </Button>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(c)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteCategory(c.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">No categories found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
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
  Plus,
  RefreshCw,
  Save,
  X,
  Edit,
  Trash2,
  Percent,
  CircleDollarSign,
  Calendar,
  AlertCircle,
  Search,
} from "lucide-react";
import axios from "axios";
import { getCookie } from "@/lib/csrf";

const emptyForm = {
  code: "",
  name: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  minimum_order_value: "",
  max_uses_total: "",
  max_uses_per_user: "",
  valid_from: "",
  valid_until: "",
  is_active: true,
  no_return_policy: false,
};

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

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
      const [listRes, statsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/coupons/`, {
          withCredentials: true,
          headers,
        }),
        axios
          .get(`${BASE_URL}/api/admin/coupon-stats/`, {
            withCredentials: true,
            headers,
          })
          .catch(() => ({ data: null })),
      ]);
      setCoupons(listRes.data || []);
      setStats(statsRes?.data || null);
    } catch (err) {
      console.error("Load coupons failed", err);
      setError(
        err?.response?.data?.detail || "Failed to load coupons. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filteredCoupons = useMemo(() => {
    if (!searchTerm) return coupons;
    const q = searchTerm.toLowerCase();
    return coupons.filter((c) =>
      [
        c.code,
        c.name,
        c.description,
        c.discount_type,
        String(c.discount_value),
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [coupons, searchTerm]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(coupon) {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code || "",
      name: coupon.name || "",
      description: coupon.description || "",
      discount_type: coupon.discount_type || "percentage",
      discount_value: String(coupon.discount_value ?? ""),
      minimum_order_value: String(coupon.minimum_order_value ?? ""),
      max_uses_total: coupon.max_uses_total ?? "",
      max_uses_per_user: coupon.max_uses_per_user ?? "",
      valid_from: coupon.valid_from ? coupon.valid_from : "",
      valid_until: coupon.valid_until ? coupon.valid_until : "",
      is_active: Boolean(coupon.is_active),
      no_return_policy: Boolean(coupon.no_return_policy),
    });
  }

  async function submitForm(e) {
    e?.preventDefault?.();
    try {
      setSaving(true);
      setError(null);
      const payload = {
        ...form,
        discount_value: form.discount_value || "0",
        minimum_order_value: form.minimum_order_value || "0",
        max_uses_total:
          form.max_uses_total === "" ? null : Number(form.max_uses_total),
        max_uses_per_user:
          form.max_uses_per_user === "" ? null : Number(form.max_uses_per_user),
      };
      if (editingId) {
        await axios.put(`${BASE_URL}/api/admin/coupons/${editingId}/`, payload, {
          withCredentials: true,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      } else {
        await axios.post(`${BASE_URL}/api/admin/coupons/`, payload, {
          withCredentials: true,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
      await loadAll();
      startCreate();
    } catch (err) {
      console.error("Save coupon failed", err);
      setError(
        err?.response?.data?.detail || "Failed to save coupon. Please check inputs."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCoupon(id) {
    if (!confirm("Delete this coupon?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/coupons/${id}/`, {
        withCredentials: true,
        headers,
      });
      await loadAll();
    } catch (err) {
      console.error("Delete coupon failed", err);
      setError(err?.response?.data?.detail || "Failed to delete coupon.");
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading coupons...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Coupon Management</h1>
        <p className="text-muted-foreground text-lg">
          Manage discount codes, configure policies, and track usage.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Percent className="text-sidebar-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_coupons ?? coupons.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All coupons</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CircleDollarSign className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_coupons ?? coupons.filter(c=>c.is_active).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently usable</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Calendar className="text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.expired_coupons ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Past valid-until</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Discount Given</CardTitle>
            <CircleDollarSign className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(stats?.total_discount_given ?? 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across usages</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Create / Edit form */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>{editingId ? "Edit Coupon" : "Create Coupon"}</CardTitle>
              <CardDescription>
                {editingId ? `Editing ID #${editingId}` : "Define coupon properties and save"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={startCreate} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={submitForm} disabled={saving} className="bg-sidebar-primary hover:bg-sidebar-primary/90">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input name="code" value={form.code} onChange={handleChange} placeholder="Code (e.g., SAVE20)" />
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
            <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" />

            <div className="flex gap-2">
              <select name="discount_type" value={form.discount_type} onChange={handleChange} className="px-3 py-2 border border-gray-200 rounded-md w-full">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <Input name="discount_value" value={form.discount_value} onChange={handleChange} placeholder={form.discount_type === "percentage" ? "Percent (e.g., 20)" : "Amount (e.g., 10.00)"} />
            </div>

            <Input name="minimum_order_value" value={form.minimum_order_value} onChange={handleChange} placeholder="Minimum order value (optional)" />
            <Input name="max_uses_total" value={form.max_uses_total} onChange={handleChange} placeholder="Max uses total (optional)" />
            <Input name="max_uses_per_user" value={form.max_uses_per_user} onChange={handleChange} placeholder="Max uses per user (optional)" />

            <Input name="valid_from" type="datetime-local" value={form.valid_from} onChange={handleChange} placeholder="Valid from" />
            <Input name="valid_until" type="datetime-local" value={form.valid_until} onChange={handleChange} placeholder="Valid until" />

            <div className="flex items-center gap-2">
              <input id="is_active" name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} />
              <label htmlFor="is_active" className="text-sm">Active</label>
            </div>
            <div className="flex items-center gap-2">
              <input id="no_return_policy" name="no_return_policy" type="checkbox" checked={form.no_return_policy} onChange={handleChange} />
              <label htmlFor="no_return_policy" className="text-sm">No return policy</label>
            </div>
          </form>
          {error && (
            <p className="text-red-600 text-sm mt-3 flex items-center gap-2"><AlertCircle className="h-4 w-4" />{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Coupons list */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Coupons</CardTitle>
              <CardDescription>List, filter and manage your coupons</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search by code, name, type..." className="pl-10" />
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
                  <th className="text-left py-3 px-4 font-medium">Code</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Value</th>
                  <th className="text-left py-3 px-4 font-medium">Active</th>
                  <th className="text-left py-3 px-4 font-medium">No Return</th>
                  <th className="text-left py-3 px-4 font-medium">Valid</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{c.code}</td>
                    <td className="py-3 px-4">{c.name}</td>
                    <td className="py-3 px-4">
                      <Badge className="capitalize">{c.discount_type}</Badge>
                    </td>
                    <td className="py-3 px-4">{c.discount_value}</td>
                    <td className="py-3 px-4">
                      <Badge variant={c.is_active ? "default" : "outline"} className={c.is_active ? "bg-green-100 text-green-800" : ""}>
                        {c.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={c.no_return_policy ? "destructive" : "outline"}>
                        {c.no_return_policy ? "No Returns" : "Allowed"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div>{c.valid_from ? new Date(c.valid_from).toLocaleDateString() : "-"} → {c.valid_until ? new Date(c.valid_until).toLocaleDateString() : "-"}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(c)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteCoupon(c.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCoupons.length === 0 && (
            <div className="text-center py-8 text-gray-500">No coupons found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

///
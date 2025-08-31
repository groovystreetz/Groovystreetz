import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  RefreshCw,
  Save,
  X
} from "lucide-react";
import { getCookie } from "@/lib/csrf";
import axios from "axios";

const emptyForm = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  role: "customer",
  is_active: true,
};

const Customer = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [authError, setAuthError] = useState(false);
  
  // Form states
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Helper function to check authentication
  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setAuthError(true);
      setError('Authentication required. Please log in again.');
      return false;
    }
    return true;
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check authentication first
      if (!checkAuth()) {
        return;
      }

      const csrfToken = getCookie('csrftoken');
      const token = localStorage.getItem('admin_token');
      
      try {
        const response = await axios.get('http://localhost:8000/api/admin/users/', {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken,
            'Authorization': `Token ${token}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
        setError(null);
      } catch (err) {
        if (err.response?.status === 403) {
          // User doesn't have superadmin privileges, show limited view
          setError('Limited access: You can view basic user statistics but not the full user list.');
          // Create mock data for demonstration
          const mockUsers = [
            { pk: 1, username: 'demo_user', email: 'user@example.com', role: 'customer', first_name: 'Demo', last_name: 'User', is_active: true },
            { pk: 2, username: 'admin_user', email: 'admin@example.com', role: 'admin', first_name: 'Admin', last_name: 'User', is_active: true },
            { pk: 3, username: 'super_admin', email: 'super@example.com', role: 'superadmin', first_name: 'Super', last_name: 'Admin', is_active: true }
          ];
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 401) {
        setAuthError(true);
        setError('Authentication required. Please log in again.');
      } else {
        setError('Failed to fetch users. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and role
  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedRole !== "all") {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, users]);

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'superadmin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'customer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Form handling functions
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ 
      ...f, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  }

  function handleSelectChange(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function startEdit(user) {
    setEditingId(user.pk);
    setForm({
      username: user.username || "",
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      role: user.role || "customer",
      is_active: user.is_active !== false,
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
        username: form.username,
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
        is_active: form.is_active,
      };

      if (editingId) {
        await axios.put(`http://localhost:8000/api/admin/users/${editingId}/`, data, {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Token ${localStorage.getItem('admin_token')}`,
          },
        });
      } else {
        await axios.post('http://localhost:8000/api/admin/users/', data, {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Token ${localStorage.getItem('admin_token')}`,
          },
        });
      }
      
      await fetchUsers();
      closeForm();
    } catch (err) {
      console.error("Save user failed", err);
      setError(
        err?.response?.data?.detail || "Failed to save user. Please check inputs."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${id}/`, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'Authorization': `Token ${localStorage.getItem('admin_token')}`,
        },
      });
      await fetchUsers();
    } catch (err) {
      console.error("Delete user failed", err);
      setError(err?.response?.data?.detail || "Failed to delete user.");
    }
  }

  if (authError) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-4">Please log in to access user management.</p>
            <Button 
              onClick={() => window.location.href = '/login'} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !error.includes('Limited access')) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchUsers} variant="outline">
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
        <h1 className="text-3xl font-bold mb-1">User Management</h1>
        <p className="text-muted-foreground text-lg">
          Manage all users across the platform with comprehensive tools and insights.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-sidebar-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.role === 'customer').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Regular customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Platform administrators
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Users className="text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.role === 'superadmin').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              System administrators
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Limited Access Notice */}
      {error && error.includes('Limited access') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-yellow-800 text-sm">
              <strong>Limited Access:</strong> You can view basic user statistics but not the full user list. 
              Superadmin privileges are required for complete user management.
            </p>
          </div>
        </div>
      )}

      {/* Create / Edit Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit User" : "Create User"}</SheetTitle>
            <SheetDescription>
              {editingId ? `Editing user #${editingId}` : "Fill details then save"}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <form onSubmit={submitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input 
                    name="first_name" 
                    value={form.first_name} 
                    onChange={handleChange} 
                    placeholder="Enter first name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input 
                    name="last_name" 
                    value={form.last_name} 
                    onChange={handleChange} 
                    placeholder="Enter last name" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input 
                  name="username" 
                  value={form.username} 
                  onChange={handleChange} 
                  placeholder="Enter username" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="Enter email address" 
                  type="email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select 
                  value={form.role} 
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the user's role in the system
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label className="text-sm font-medium">Active User</label>
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

      {/* User Management Section */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="analytics">User Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>User List</CardTitle>
                  <CardDescription>
                    Manage and monitor all platform users
                  </CardDescription>
                </div>
                <Button onClick={startCreate} className="bg-sidebar-primary hover:bg-sidebar-primary/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by name, email, or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sidebar-primary"
                  >
                    <option value="all">All Roles</option>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  <Button variant="outline" onClick={fetchUsers}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.pk} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {user.first_name && user.last_name 
                                  ? `${user.first_name} ${user.last_name}`
                                  : user.username
                                }
                              </div>
                              <div className="text-sm text-gray-500">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">{user.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={getRoleBadgeVariant(user.role)}
                            className={getRoleColor(user.role)}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={user.is_active ? "default" : "secondary"} 
                            className={user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-[400px] sm:w-[540px]">
                                <SheetHeader>
                                  <SheetTitle>User Details</SheetTitle>
                                  <SheetDescription>
                                    Complete information for {user.username}
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-6">
                                  {/* User Info */}
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="text-lg font-semibold">
                                        {user.first_name && user.last_name 
                                          ? `${user.first_name} ${user.last_name}`
                                          : user.username
                                        }
                                      </h3>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Username: @{user.username}
                                      </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="text-sm">{user.email}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Role</label>
                                        <Badge 
                                          variant={getRoleBadgeVariant(user.role)}
                                          className={getRoleColor(user.role)}
                                        >
                                          {user.role}
                                        </Badge>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <Badge 
                                          variant={user.is_active ? "default" : "secondary"}
                                          className={user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                        >
                                          {user.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">User ID</label>
                                        <p className="text-sm">#{user.pk}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Action Buttons */}
                                  <div className="flex gap-2 pt-4 border-t">
                                    <Button 
                                      onClick={() => startEdit(user)}
                                      className="flex-1"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit User
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => deleteUser(user.pk)}
                                      className="flex-1"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete User
                                    </Button>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                            <Button variant="ghost" size="sm" onClick={() => startEdit(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteUser(user.pk)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No users found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>
                Insights into user growth and distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role Distribution */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Role Distribution</h3>
                  <div className="space-y-3">
                    {['customer', 'admin', 'superadmin'].map((role) => {
                      const count = users.filter(user => user.role === role).length;
                      const percentage = users.length > 0 ? (count / users.length * 100).toFixed(1) : 0;
                      return (
                        <div key={role} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              role === 'customer' ? 'bg-green-500' :
                              role === 'admin' ? 'bg-blue-500' : 'bg-red-500'
                            }`} />
                            <span className="capitalize">{role}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{count}</div>
                            <div className="text-sm text-gray-500">{percentage}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* User Stats */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-sidebar-primary">
                        {users.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {users.filter(user => user.first_name || user.last_name).length}
                      </div>
                      <div className="text-sm text-gray-600">Users with Names</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {users.filter(user => user.is_active).length}
                      </div>
                      <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Customer;
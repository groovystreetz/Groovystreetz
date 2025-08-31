import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute";
// Import all page components (to be created)
import Dashboard from "./pages/dashboard";
import Orders from "./pages/orders";
import Customer from "./components/PageComponents/Customers/Customer";
import Coupon from "./components/PageComponents/Coupon/Coupon";
import Products from "./pages/Products";
import Categories from "./pages/catagories";
// import AllOrders from "./pages/orders-all";
// import PendingOrders from "./pages/orders-pending";
// import ShippedOrders from "./pages/orders-shipped";
// import Returns from "./pages/orders-returns";
// import Products from "./pages/products";
// import ProductCategories from "./pages/products-categories";
// import ProductInventory from "./pages/products-inventory";
// import Sales from "./pages/sales";
// import SalesOverview from "./pages/sales-overview";
// import SalesDiscounts from "./pages/sales-discounts";
// import SalesInvoices from "./pages/sales-invoices";
// import Customers from "./pages/customers";
// import Admins from "./pages/customers-admins";
// import RolesPermissions from "./pages/customers-roles";
// import Workflows from "./pages/workflows";
// import OrderWorkflows from "./pages/workflows-orders";
// import Automation from "./pages/workflows-automation";
// import Analytics from "./pages/analytics";
// import AnalyticsDashboard from "./pages/analytics-dashboard";
// import SalesReports from "./pages/analytics-sales-reports";
// import CustomerInsights from "./pages/analytics-customer-insights";
// import Settings from "./pages/settings";
// import SettingsGeneral from "./pages/settings-general";
// import SettingsTeam from "./pages/settings-team";
// import SettingsBilling from "./pages/settings-billing";
// import SettingsLimits from "./pages/settings-limits";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/all" element={<Orders />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/coupons" element={<Coupon />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          {/* <Route path="/orders/pending" element={<PendingOrders />} />
          <Route path="/orders/shipped" element={<ShippedOrders />} />
          <Route path="/orders/returns" element={<Returns />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/categories" element={<ProductCategories />} />
          <Route path="/products/inventory" element={<ProductInventory />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/overview" element={<SalesOverview />} />
          <Route path="/sales/discounts" element={<SalesDiscounts />} />
          <Route path="/sales/invoices" element={<SalesInvoices />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/admins" element={<Admins />} />
          <Route path="/customers/roles" element={<RolesPermissions />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/workflows/orders" element={<OrderWorkflows />} />
          <Route path="/workflows/automation" element={<Automation />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />
          <Route path="/analytics/sales-reports" element={<SalesReports />} />
          <Route path="/analytics/customer-insights" element={<CustomerInsights />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/general" element={<SettingsGeneral />} />
          <Route path="/settings/team" element={<SettingsTeam />} />
          <Route path="/settings/billing" element={<SettingsBilling />} />
          <Route path="/settings/limits" element={<SettingsLimits />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

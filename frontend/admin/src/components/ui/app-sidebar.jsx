"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  ShoppingCart,
  Package,
  BarChart2,
  Users,
  Workflow,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/Layout/nav-main"
import { NavProjects } from "@/components/Layout/nav-projects"
import { NavUser } from "@/components/Layout/nav-user"
import { TeamSwitcher } from "@/components/Layout/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


const data = {
  user: {
    name: "Admin User",
    email: "admin@ecommerce.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Ecom Main",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Wholesale",
      logo: AudioWaveform,
      plan: "B2B",
    },
    {
      name: "Retail",
      logo: Command,
      plan: "B2C",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
      isActive: true,
      items: [
        { title: "All Orders", url: "/orders" },
        { title: "Pending", url: "/orders?status=pending" },
        { title: "Shipped", url: "/orders?status=shipped" },
        { title: "Returns", url: "/orders?status=returns" },
      ],
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
      items: [
        { title: "All Products", url: "/products" },
        { title: "Categories", url: "/products/categories" },
        { title: "Inventory", url: "/products/inventory" },
      ],
    },
    {
      title: "Sales",
      url: "/sales",
      icon: BarChart2,
      items: [
        { title: "Overview", url: "/sales/overview" },
        { title: "Discounts", url: "/sales/discounts" },
        { title: "Invoices", url: "/sales/invoices" },
      ],
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
      items: [
        { title: "All Customers", url: "/customers" },
        { title: "Admins", url: "/customers/admins" },
        { title: "Roles & Permissions", url: "/customers/roles" },
      ],
    },
    {
      title: "Workflows",
      url: "/workflows",
      icon: Workflow,
      items: [
        { title: "Order Workflows", url: "/workflows/orders" },
        { title: "Automation", url: "/workflows/automation" },
      ],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: PieChart,
      items: [
        { title: "Dashboard", url: "/analytics/dashboard" },
        { title: "Sales Reports", url: "/analytics/sales-reports" },
        { title: "Customer Insights", url: "/analytics/customer-insights" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/settings/general" },
        { title: "Team", url: "/settings/team" },
        { title: "Billing", url: "/settings/billing" },
        { title: "Limits", url: "/settings/limits" },
      ],
    },
  ],
  projects: [
    {
      name: "Order Workflows",
      url: "/workflows/orders",
      icon: Workflow,
    },
    {
      name: "Product Launches",
      url: "/products/launches",
      icon: Package,
    },
    {
      name: "Sales Campaigns",
      url: "/sales/campaigns",
      icon: BarChart2,
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

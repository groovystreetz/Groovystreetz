import React from "react";
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
import { Users, DollarSign, Truck, ShoppingCart, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { NumberTicker } from "@/components/ui/NumberTicker";

const earningData = [
  { month: "Jan", earning: 12000 },
  { month: "Feb", earning: 15000 },
  { month: "Mar", earning: 18000 },
  { month: "Apr", earning: 14000 },
  { month: "May", earning: 20000 },
  { month: "Jun", earning: 22000 },
];

const userData = [
  { month: "Jan", users: 200 },
  { month: "Feb", users: 250 },
  { month: "Mar", users: 300 },
  { month: "Apr", users: 350 },
  { month: "May", users: 400 },
  { month: "Jun", users: 500 },
];

const deliveryData = [
  { status: "Delivered", value: 320 },
  { status: "Pending", value: 45 },
  { status: "Cancelled", value: 15 },
];

const orderData = [
  { day: "Mon", orders: 40 },
  { day: "Tue", orders: 55 },
  { day: "Wed", orders: 60 },
  { day: "Thu", orders: 48 },
  { day: "Fri", orders: 70 },
  { day: "Sat", orders: 90 },
  { day: "Sun", orders: 30 },
];

const COLORS = ["#f59e42", "#fbbf24", "#f87171"];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 ">
      <div>
        <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Empowering administrators with comprehensive tools for managing the e-commerce platform.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="text-sidebar-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={109000} decimalPlaces={2} className="text-2xl font-bold" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +<NumberTicker value={12} decimalPlaces={0} className="inline font-bold text-green-600" />% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-sidebar-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={4200} className="text-2xl font-bold" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +<NumberTicker value={8} decimalPlaces={0} className="inline font-bold text-green-600" />% new users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
            <Truck className="text-sidebar-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={320} className="text-2xl font-bold" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +<NumberTicker value={5} decimalPlaces={0} className="inline font-bold text-green-600" />% this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="text-sidebar-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={1200} className="text-2xl font-bold" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +<NumberTicker value={10} decimalPlaces={0} className="inline font-bold text-green-600" />% this month
            </p>
          </CardContent>
        </Card>
      </div>
      <Separator />
      <Tabs defaultValue="earnings" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Status</TabsTrigger>
        </TabsList>
        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>
                Track your monthly earnings growth.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartTooltip />
                    <Bar dataKey="earning" fill="#f59e42" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                New users joined each month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartTooltip />
                    <Line type="monotone" dataKey="users" stroke="#f59e42" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders This Week</CardTitle>
              <CardDescription>
                Daily order volume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartTooltip />
                    <Bar dataKey="orders" fill="#f59e42" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Status</CardTitle>
              <CardDescription>
                Overview of order delivery statuses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="h-64 w-full md:w-1/2 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deliveryData}
                        dataKey="value"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        label={({ percent, status }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                        paddingAngle={2}
                      >
                        {deliveryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                      <RechartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <span className="text-lg font-semibold">Total Orders: </span>
                    <span className="font-bold text-primary">
                      <NumberTicker value={deliveryData.reduce((a, b) => a + b.value, 0)} className="text-lg font-bold text-primary" />
                    </span>
                  </div>
                </div>
                <div className="space-y-3 w-full md:w-1/2">
                  {deliveryData.map((item, idx) => (
                    <div key={item.status} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 shadow-sm">
                      <span
                        className="inline-block w-4 h-4 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="font-medium text-base">{item.status}</span>
                      <span className="ml-auto text-muted-foreground text-sm">
                        <NumberTicker value={item.value} className="text-base font-bold text-muted-foreground" /> orders
                      </span>
                      <span className="ml-2">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {((item.value / deliveryData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
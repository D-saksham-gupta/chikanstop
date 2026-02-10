"use client";

import { useState, useEffect } from "react";
import { Card, LoadingSpinner } from "@/components/ui";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30");
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return <div>Failed to load analytics</div>;
  }

  const COLORS = ["#f43f5e", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  // Prepare order status data for pie chart
  const orderStatusData = Object.entries(analytics.ordersByStatus).map(
    ([status, count]) => ({
      name: status,
      value: count,
    }),
  );

  // Prepare payment methods data
  const paymentMethodsData = Object.entries(analytics.paymentMethods).map(
    ([method, count]) => ({
      name: method,
      value: count,
    }),
  );

  const stats = [
    {
      name: "Total Revenue",
      value: `₹${analytics.overview.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      name: "Total Orders",
      value: analytics.overview.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-blue-500",
      trend: "+8.2%",
      trendUp: true,
    },
    {
      name: "Total Products",
      value: analytics.overview.totalProducts.toLocaleString(),
      icon: Package,
      color: "bg-purple-500",
      trend: `${analytics.overview.outOfStock} out of stock`,
      trendUp: false,
    },
    {
      name: "Total Customers",
      value: analytics.overview.totalCustomers.toLocaleString(),
      icon: Users,
      color: "bg-orange-500",
      trend: `+${analytics.overview.newCustomers} new`,
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your store performance</p>
        </div>

        {/* Period Selector */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;

          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trendUp ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {stat.trendUp && <TrendIcon className="w-4 h-4" />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Average Order Value
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            ₹{Math.round(analytics.overview.averageOrderValue).toLocaleString()}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Active Products
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics.overview.activeProducts}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            New Customers
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {analytics.overview.newCustomers}
          </p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Daily Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                formatter={(value: any) => `₹${value.toLocaleString()}`}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f43f5e"
                strokeWidth={2}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Orders Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Orders</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dailyOrders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Orders by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent || 1) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Payment Methods
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent || 1) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Top Selling Products
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.topProducts.map((product: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{product.quantity}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      ₹{product.revenue.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Customers */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Recent Customers
        </h2>
        <div className="space-y-4">
          {analytics.recentCustomers.map((customer: any) => (
            <div
              key={customer._id}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900">{customer.name}</p>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

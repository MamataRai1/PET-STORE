"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, Package } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalCustomers: 0,
    analyticsScore: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:8000/api/admin/dashboard/")
      if (!res.ok) throw new Error("API error")

      const data = await res.json()

      setStats({
        totalProducts: data.total_products || 0,
        totalSales: data.total_sales || 0,
        totalCustomers: data.total_customers || 0,
        analyticsScore: data.analytics_score || 0,
      })

      setRecentOrders(data.recent_orders || [])
      setTopProducts(data.top_products || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setStats({
        totalProducts: 0,
        totalSales: 0,
        totalCustomers: 0,
        analyticsScore: 0,
      })
      setRecentOrders([])
      setTopProducts([])
    } finally {
      setLoading(false)
    }
  }

  const statsDisplay = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      change: "+12%",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Total Sales",
      value: `$${stats.totalSales.toLocaleString()}`,
      change: "+8%",
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: "+15%",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Analytics",
      value: `${stats.analyticsScore}%`,
      change: "+3%",
      icon: BarChart3,
      color: "bg-orange-500",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsDisplay.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.total}</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.main_image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{product.sold_count} sold</p>
                    <p className="text-sm text-gray-600">Rs{product.total_revenue}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No product data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react"

export default function Sidebar({ activeSection, setActiveSection }) {
  const [productsExpanded, setProductsExpanded] = useState(true)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "products",
      label: "Products",
      icon: Package,
      hasSubmenu: true,
      submenu: [
        { id: "product-list", label: "Product List" },
        { id: "categories", label: "Categories" },
      ],
    },
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // Logout handler with confirmation
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Remove stored token or any auth data
      localStorage.removeItem("adminToken")
      // Redirect user to login page
      window.location.href = "/login"
    }
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-gray-900">Petnest Admin</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <div>
                <button
                  onClick={() => {
                    if (item.hasSubmenu) {
                      setProductsExpanded(!productsExpanded)
                    } else {
                      setActiveSection(item.id)
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id ||
                    (item.hasSubmenu && ["product-list", "categories"].includes(activeSection))
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.hasSubmenu &&
                    (productsExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </button>

                {/* Submenu */}
                {item.hasSubmenu && productsExpanded && (
                  <ul className="mt-2 ml-8 space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.id}>
                        <button
                          onClick={() => setActiveSection(subItem.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeSection === subItem.id
                              ? "bg-purple-100 text-purple-700"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          {subItem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}

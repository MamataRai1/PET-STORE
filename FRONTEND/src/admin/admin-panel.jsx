"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./header"
import Dashboard from "./Dashboard"
import ProductList from "./Product-List"
import ProductForm from "./product-form"
import Categories from "./categories"
import Customers from "./Customers"

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowProductForm(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleCloseForm = () => {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  const handleSaveProduct = (product) => {
    // Product saved successfully - you can add more logic here
    console.log("Product saved:", product)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "product-list":
        return <ProductList onAddProduct={handleAddProduct} onEditProduct={handleEditProduct} />
      case "categories":
        return <Categories />
      case "sales":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
            <p className="text-gray-600 mt-1">View sales reports and analytics</p>
          </div>
        )
      case "customers":
        return <Customers />
      case "analytics":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">View detailed analytics and reports</p>
          </div>
        )
      case "notifications":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">Manage system notifications</p>
          </div>
        )
      case "settings":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Configure system settings</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  )
}

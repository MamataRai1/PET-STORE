"use client"

import { useState, useEffect } from "react"
import { Filter, Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductList({ onAddProduct, onEditProduct }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`http://127.0.0.1:8000/api/product/?page=${currentPage}`)
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      // If data is an array, use it directly
      if (Array.isArray(data)) {
        setProducts(data)
        setTotalPages(1) // No pagination
      } else {
        setProducts(data.results || [])
        setTotalPages(Math.ceil((data.count || 0) / 10))
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/product/${id}/`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      fetchProducts()
    } catch (error) {
      alert("Error deleting product")
      console.error(error)
    }
  }

  const getStatusBadge = (status) => {
    const classes = {
      Active: "bg-green-100 text-green-800",
      Draft: "bg-yellow-100 text-yellow-800",
      Scheduled: "bg-blue-100 text-blue-800",
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Products list</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg">See All</button>

          <button
            onClick={onAddProduct}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Product Name</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Stock</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.main_image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {product.categories && product.categories.length > 0
                    ? product.categories.map((cat) => cat.name).join(", ")
                    : "Uncategorized"}
                </td>
                <td className="px-6 py-4 text-gray-900">${product.price}</td>
                <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const page = i + 1
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg ${
                  currentPage === page ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          })}
          {totalPages > 5 && <span className="text-gray-400">...</span>}
          <span className="text-gray-600">{totalPages}</span>
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // No pagination since backend returns a plain array
  // You can implement client-side pagination if needed

  useEffect(() => {
    fetchCustomers()
  }, [searchTerm]) // refetch when searchTerm changes

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      // Adjust API URL and params as needed
      const response = await fetch(`http://127.0.0.1:8000/api/users/?search=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      // Backend returns plain array of users
      setCustomers(data)
    } catch (error) {
      console.error("Error fetching customers:", error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const deleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${customerId}/`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error("Failed to delete customer")
        // Refresh the list after deletion
        fetchCustomers()
      } catch (error) {
        console.error("Error deleting customer:", error)
        alert("Error deleting customer")
      }
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage customer information</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={customer.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={customer.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{customer.username}</p>
                        <p className="text-sm text-gray-600">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{customer.address}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View</button>
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import React, { useState } from "react";
import { User, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignInPage = () => {
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => setRole(newRole);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: formData.username,
        password: formData.password,
      });

      // Store tokens in localStorage
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("Login successful!");
      console.log("Token in localStorage:", localStorage.getItem("access"));

      // Role-based redirection
      if (role === "customer") {
        navigate("/admin-dashboard");  // Admin dashboard route
      } else {
        console.log("error") ;    // Customer dashboard route
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-2">
          PET<span className="text-gray-800">NEST</span>
        </h1>
        <p className="text-center text-gray-500 mb-6">Welcome back! 🐾</p>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => handleRoleChange("customer")}
            className={`px-4 py-2 rounded-full font-semibold text-sm ${
              role === "customer"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-600"
            } transition`}
          >
            Customer
          </button>
          <button
            onClick={() => handleRoleChange("admin")}
            className={`px-4 py-2 rounded-full font-semibold text-sm ${
              role === "admin"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-600"
            } transition`}
          >
            Admin
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
              disabled={loading}
            />
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
              disabled={loading}
            />
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading
              ? "Signing in..."
              : `Sign In as ${role === "admin" ? "Admin" : "Customer"}`}
          </button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-orange-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;

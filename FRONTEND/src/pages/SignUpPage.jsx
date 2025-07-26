import React, { useState } from "react";
import axios from "axios";
import { User, Lock, Mail, Phone, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (r) => setRole(r);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...formData,
      is_customer: role === "customer",
      is_seller: role === "seller",
    };

    console.log("Sending user data:", dataToSend);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/",
        dataToSend,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("User registered successfully!");
      console.log("Response data:", res.data);

      // Clear form after success
      setFormData({
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });

      // Redirect to login page after successful signup
      navigate("/login");
    } catch (err) {
      console.error("Backend validation error:", err.response?.data);
      alert(
        "Registration failed: " +
          (err.response?.data
            ? JSON.stringify(err.response.data)
            : err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-yellow-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-2">
          Join <span className="text-gray-800">PetNest</span>
        </h1>
        <p className="text-center text-gray-500 mb-6">Create an account 🐾</p>

        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange("customer")}
            className={`px-4 py-2 rounded-full font-semibold text-sm ${
              role === "customer"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("seller")}
            className={`px-4 py-2 rounded-full font-semibold text-sm ${
              role === "seller"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Seller
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
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
              disabled={loading}
            />
            <Mail
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

          <div className="relative">
            <input
              type="text"
              name="phone"
              placeholder="Phone (Optional)"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              disabled={loading}
            />
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <div className="relative">
            <textarea
              name="address"
              placeholder="Address (Optional)"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
              disabled={loading}
            />
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {loading ? "Signing up..." : `Sign Up as ${role}`}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

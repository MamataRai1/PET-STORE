import React, { useState } from "react";
import { User, Lock } from "lucide-react";

const SignInPage = () => {
  const [role, setRole] = useState("customer");

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Logo & Title */}
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-2">
          PET<span className="text-gray-800">NEST</span>
        </h1>
        <p className="text-center text-gray-500 mb-6">Welcome back! 🐾</p>

        {/* Role Toggle */}
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

        {/* Sign-In Form */}
        <form className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Sign In as {role === "admin" ? "Admin" : "Customer"}
          </button>
        </form>

        {/* Optional footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-orange-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;

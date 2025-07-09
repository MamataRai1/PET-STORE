

import React, { useState } from "react";
import { User, Lock, Mail } from "lucide-react";

const SignUpPage = () => {
  const [role, setRole] = useState("customer");

  const handleRoleChange = (r) => setRole(r);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-yellow-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-2">
          Join <span className="text-gray-800">PetNest</span>
        </h1>
        <p className="text-center text-gray-500 mb-6">Create an account 🐾</p>

        {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
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
            onClick={() => handleRoleChange("admin")}
            className={`px-4 py-2 rounded-full font-semibold text-sm ${
              role === "admin"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Signup Form */}
        <form className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
          >
            Sign Up as {role}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-orange-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

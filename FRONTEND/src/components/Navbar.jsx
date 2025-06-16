// src/components/Navbar.jsx
import React from "react";
import { User, Heart, ShoppingCart, Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white text-gray-800 shadow-md border-b px-8 py-4 flex justify-between items-center">
      {/* Left: Logo */}
      <div className="text-2xl font-bold">
        PET<span className="text-orange-400">NEST</span>
      </div>

      {/* Center: Navigation Links */}
      <ul className="flex gap-8 font-medium text-md">
        <li><a href="/" className="hover:text-orange-400 transition">Home</a></li>
        <li><a href="/shop" className="hover:text-orange-400 transition">Product</a></li>
        <li><a href="/featured" className="hover:text-orange-400 transition">Category</a></li>
      </ul>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-md mx-8">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {/* Right: Icons & Help Info */}
      <div className="flex items-center gap-6">
        <div className="flex gap-4 text-gray-800 text-lg">
          <User className="cursor-pointer hover:text-orange-400 transition-colors" size={20} />
          <Heart className="cursor-pointer hover:text-orange-400 transition-colors" size={20} />
          <ShoppingCart className="cursor-pointer hover:text-orange-400 transition-colors" size={20} />
        </div>
         
      </div>
    </nav>
  );
};

export default Navbar;
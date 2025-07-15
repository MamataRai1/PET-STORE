import React, { useState } from "react";
import { User, Heart, ShoppingCart, Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-orange-50 text-gray-800 shadow-md border-b px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold">
          PET<span className="text-orange-500">NEST</span>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-8 font-medium text-md">
          <li><Link to="/" className="hover:text-orange-500 transition">Home</Link></li>
          <li><Link to="/shop" className="hover:text-orange-500 transition">Product</Link></li>
          <li><Link to="/featured" className="hover:text-orange-500 transition">Category</Link></li>
        </ul>


        {/* Search Bar (Hidden on mobile) */}
        <div className="hidden md:block relative flex-1 max-w-md mx-6">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Icons + Hamburger */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex gap-4 text-gray-800 text-lg">
            <Link to="signin">
               <User className="cursor-pointer hover:text-orange-500 transition-colors" size={20} />
            </Link>
            <Heart className="cursor-pointer hover:text-orange-500 transition-colors" size={20} />
            <ShoppingCart className="cursor-pointer hover:text-orange-500 transition-colors" size={20} />
          </div>

          {/* Hamburger Icon */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
     {menuOpen && (
  <div className="md:hidden mt-4 px-4 space-y-4 animate-slideDown">
    <Link to="/" className="block text-lg hover:text-orange-500">Home</Link>
    <Link to="/shop" className="block text-lg hover:text-orange-500">Product</Link>
    <Link to="/featured" className="block text-lg hover:text-orange-500">Category</Link>

    <div className="flex gap-4 pt-4 border-t border-gray-200 text-gray-800">
      <Link to="/signin">
        <User className="cursor-pointer hover:text-orange-500" size={20} />
      </Link>
      <Heart className="cursor-pointer hover:text-orange-500" size={20} />
      <ShoppingCart className="cursor-pointer hover:text-orange-500" size={20} />
    </div>
  </div>
)}

    </nav>
  );
};

export default Navbar;

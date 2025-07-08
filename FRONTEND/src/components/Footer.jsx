import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Single row with Logo/Description, Contact Us, and Quick Links */}
        <div className="flex justify-between items-start mb-8">
          {/* Logo and Description - Left Side */}
          <div>
            <h2 className="text-2xl font-bold text-blue-50">PetNest</h2>
            <p className="mt-2 text-gray-400">
              Your one-stop pet store for love, <br />
              care & everything your furry friend needs.
            </p>
          </div>

          {/* Contact Info - Center */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-gray-400">Email: support@petnest.com</p>
            <p className="text-gray-400">Phone: +977-9800000000</p>
            <p className="text-gray-400">Location: Itahari, Nepal</p>
          </div>

          {/* Quick Links - Right Side */}
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-teal-300">Home</a></li>
              <li><a href="#" className="hover:text-teal-300">Shop</a></li>
              <li><a href="#" className="hover:text-teal-300">About Us</a></li>
              <li><a href="#" className="hover:text-teal-300">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-gray-500 mt-8 text-sm border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} PetNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
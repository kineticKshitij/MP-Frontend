import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const showReturnLink =
    location.pathname === "/addEmployee" || location.pathname === "/manageEmployee";

  return (
    <nav className="relative">
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-95 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative flex justify-between items-center px-10 py-4">
        <ul className="flex space-x-8">
          <li>
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-1"
            >
              <span>🏠</span>
              <span className="hover:tracking-wider transition-all">Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-1"
            >
              <span>📞</span>
              <span className="hover:tracking-wider transition-all">Contact</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-1"
            >
              <span>ℹ️</span>
              <span className="hover:tracking-wider transition-all">About</span>
            </Link>
          </li>
        </ul>

        {showReturnLink && (
          <Link
            to="/OrgDash"
            className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-xl 
                       shadow-lg hover:shadow-xl transition-all duration-300 
                       border border-gray-700 hover:border-gray-600
                       flex items-center space-x-2"
          >
            <span>←</span>
            <span>Return to Dashboard</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

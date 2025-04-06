import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // We only want to show "Return to Dashboard" on these routes:
  const showReturnLink =
    location.pathname === "/addEmployee" || location.pathname === "/manageEmployee";

  return (
    <div className="flex justify-between items-center px-10 py-4 bg-gray-800 text-white">
      <ul className="flex space-x-6">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:underline">
            About
          </Link>
        </li>
      </ul>

      {/* Conditionally render the Return to Dashboard link */}
      {showReturnLink && (
        <Link
          to="/OrgDash"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Return to Dashboard
        </Link>
      )}
    </div>
  );
};

export default Navbar;

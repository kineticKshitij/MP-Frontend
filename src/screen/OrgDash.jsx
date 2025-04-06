import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const OrgDash = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Organization");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the JWT access token from localStorage
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/org/dashboard/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setName(data.organization.name || "Organization");
        setLogo(data.organization.logo || null);
      } catch (err) {
        console.error("Failed to fetch organization data:", err);
        setError("Failed to load organization data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrgData();
    } else {
      setError("No access token found. Please log in.");
      setLoading(false);
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg text-center">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {name}</h1>
            <div className="my-6">
              {logo ? (
                <img src={logo} alt="Organization Logo" className="h-32 w-32 object-contain mx-auto" />
              ) : (
                <p className="text-gray-500">No logo available</p>
              )}
            </div>
            <Link to="/addEmployee" className="block bg-blue-500 text-white p-3 rounded-lg my-2">
              Register Employee
            </Link>
            <Link to="/manageEmployee" className="block bg-blue-500 text-white p-3 rounded-lg">
              Manage Employees
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default OrgDash;

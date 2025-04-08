import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const OrgDash = () => {
  const navigate = useNavigate();
  const [orgData, setOrgData] = useState({
    organization: {
      name: "Organization",
      logo: null,
      email: ""
    },
    stats: {
      query_count: 0,
      employee_count: 0,
      attendance_today: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the JWT access token from localStorage
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/org/dashboard/", {
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
        setOrgData(data);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 max-w-lg w-full border border-gray-100">
        {loading ? (
          <p className="text-gray-600 text-center">
            <span className="inline-block animate-pulse">Loading...</span>
          </p>
        ) : error ? (
          <p className="text-gray-800 bg-gray-100 p-4 rounded-lg text-center">{error}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              Welcome, {orgData.organization.name}
            </h1>
            <div className="my-8">
              {orgData.organization.logo ? (
                <img 
                  src={orgData.organization.logo} 
                  alt="Organization Logo" 
                  className="h-32 w-32 object-contain mx-auto rounded-lg shadow-lg border border-gray-100"
                />
              ) : (
                <div className="h-32 w-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center border-2 border-gray-200">
                  <span className="text-gray-500">No logo</span>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-sm text-gray-700 font-semibold mb-2">Employees</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {orgData.stats.employee_count}
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-sm text-gray-700 font-semibold mb-2">Present Today</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {orgData.stats.attendance_today}
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-sm text-gray-700 font-semibold mb-2">Queries</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {orgData.stats.query_count}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link 
                to="/addEmployee" 
                className="block bg-gray-900 hover:bg-black transition-all duration-300 text-white p-4 rounded-xl text-center shadow-sm hover:shadow-xl font-medium"
              >
                Register Employee
              </Link>
              <Link 
                to="/manageEmployee" 
                className="block bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 transition-all duration-300 p-4 rounded-xl text-center font-medium"
              >
                Manage Employees
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrgDash;
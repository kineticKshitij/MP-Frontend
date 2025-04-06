import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const EmpDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get JWT access token from localStorage
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/emp/dashboard/", {
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
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setError("No access token found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  // Destructure data from response:
  // Expected structure: 
  // {
  //   message, 
  //   employee: { name, email, photo, date_joined },
  //   organization: { name, logo },
  //   stats: { total_queries }
  // }
  const { employee, organization, stats } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Secondary Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex space-x-4">
            <Link to="/emp/profile" className="text-gray-700 hover:text-blue-500">Profile</Link>
            <Link to="/emp/attendance" className="text-gray-700 hover:text-blue-500">Attendance Log</Link>
            <Link to="/emp/leave" className="text-gray-700 hover:text-blue-500">Request Leave</Link>
            <Link to="/emp/documents" className="text-gray-700 hover:text-blue-500">Download Documents</Link>
            <Link to="/emp/contact-hr" className="text-gray-700 hover:text-blue-500">Contact HR</Link>
          </div>
          <button 
            onClick={() => navigate("/")} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center md:space-x-6 bg-white p-6 rounded-lg shadow">
          {/* Employee Profile Section */}
          <div className="flex flex-col items-center">
            {employee.photo ? (
              <img 
                src={employee.photo} 
                alt="Employee Profile" 
                className="w-24 h-24 rounded-full mb-4" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center text-gray-700">
                No Photo
              </div>
            )}
            <h2 className="text-xl font-semibold">{employee.name}</h2>
            <p className="text-gray-600">{employee.email}</p>
            <p className="text-gray-500 text-sm">
              Joined: {new Date(employee.date_joined).toLocaleDateString()}
            </p>
          </div>
          {/* Organization Info Section */}
          <div className="flex flex-col items-center mt-6 md:mt-0">
            {organization.logo ? (
              <img 
                src={organization.logo} 
                alt="Company Logo" 
                className="w-24 h-24 mb-4" 
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 mb-4 flex items-center justify-center text-gray-700">
                No Logo
              </div>
            )}
            <h2 className="text-xl font-semibold">{organization.name}</h2>
          </div>
        </div>
        {/* Statistics Section */}
        <div className="mt-6 bg-white p-4 rounded shadow text-center">
          <p className="text-gray-700">Total Queries: {stats.total_queries}</p>
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;

import React, { useEffect, useState } from "react";

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve your JWT token from localStorage
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);

        const response = await fetch("http://127.0.0.1:8000/api/emp/manage/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // The JSON should look like:
        // {
        //   "employees": [...],
        //   "total": 1,
        //   "page": 1,
        //   "page_size": 10,
        //   "total_pages": 1
        // }
        const data = await response.json();

        // If you want to show the org name, you can fetch it from another endpoint
        // or add it to this API’s response. For now, we'll just hard-code or set an empty string.
        setOrgName("YourOrgNameHere");

        // Store employees in state
        setEmployees(data.employees);
      } catch (err) {
        setError("Failed to load employees");
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEmployees();
    } else {
      setError("No access token found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  // Handle loading and error states
  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-center text-blue-600">
        Employees in {orgName}
      </h1>

      {employees.length > 0 ? (
        <div className="overflow-x-auto mt-6">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Unique ID</th>
                <th className="p-3">Date Joined</th>
                <th className="p-3">Photo</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-t">
                  <td className="p-3 text-center">{employee.name}</td>
                  <td className="p-3 text-center">{employee.email}</td>
                  <td className="p-3 text-center">{employee.unique_id}</td>
                  <td className="p-3 text-center">
                    {/* If you want to format the date, you can do so here */}
                    {new Date(employee.date_joined).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    {employee.photo ? (
                      <img
                        src={`http://127.0.0.1:8000${employee.photo}`}
                        alt="Employee"
                        className="w-12 h-12 rounded-full mx-auto"
                      />
                    ) : (
                      <p className="text-gray-500">No photo</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No employees found.
        </p>
      )}
    </div>
  );
};

export default ManageEmployee;

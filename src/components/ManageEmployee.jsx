import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Add this import
import { utils as xlsxUtils, writeFile as xlsxWriteFile } from 'xlsx';

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalEmployees: 0
  });
  const [monthInfo, setMonthInfo] = useState({ days_in_month: 31 }); // Update your state declarations

  // Retrieve your JWT token from localStorage
  const token = localStorage.getItem("access_token");

  // Helper function to format date
  const formatDate = (year, month, day) => {
    return `${year}-${month.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().slice(0, 10);
    return dateString === today;
  };

  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/emp/manage/?page=${page}&page_size=${pagination.pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(data.employees);
      setPagination({
        currentPage: data.page,
        pageSize: data.page_size,
        totalPages: data.total_pages,
        totalEmployees: data.total
      });
      
      // Get organization name from dashboard API
      const dashboardResponse = await fetch("http://127.0.0.1:8000/api/org/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (dashboardResponse.ok) {
        const dashData = await dashboardResponse.json();
        setOrgName(dashData.organization.name);
      }
    } catch (err) {
      setError("Failed to load employees");
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const [year, month] = selectedMonth.split('-');
      const response = await axios.get(
        `http://127.0.0.1:8000/api/emp/attendance/monthly/${year}/${month}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        // Transform the attendance records into the correct format
        const formattedData = response.data.data.map(record => ({
          date: record.date,
          employee_name: record.employee_name,
          employee_id: record.employee_id,
          timestamp: new Date(record.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: record.status
        }));

        // Debug logs
        console.log('API Response:', response.data);
        console.log('Formatted Attendance Data:', formattedData);
        
        setAttendanceData(formattedData);
        setMonthInfo({ 
          days_in_month: new Date(year, month, 0).getDate() 
        });
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceData([]);
      setError("Failed to fetch attendance data");
    }
  };

  const handleMonthChange = (e) => {
    const newDate = e.target.value;
    if (!newDate) return;

    const [year, month] = newDate.split('-');
    const currentDate = new Date();
    const selectedDate = new Date(year, month - 1);

    if (selectedDate > currentDate) {
      setError("Cannot select future dates");
      return;
    }

    setSelectedMonth(newDate);
    setError(null);
  };

  const exportToExcel = () => {
    try {
      const [year, month] = selectedMonth.split('-');
      const daysInMonth = Array.from({ length: monthInfo.days_in_month }, (_, i) => i + 1);
      
      const wsData = [
        // Header row
        ['Employee Name', 'Employee ID', 'Date', 'Status', 'Time'],
        
        // Data rows
        ...attendanceData.map(record => [
          record.employee_name,
          record.employee_id,
          new Date().toISOString().slice(0, 10),
          record.status,
          record.timestamp
        ])
      ];

      const wb = xlsxUtils.book_new();
      const ws = xlsxUtils.aoa_to_sheet(wsData);

      // Set column widths
      ws['!cols'] = [
        { wch: 20 }, // Employee Name
        { wch: 15 }, // Employee ID
        { wch: 12 }, // Date
        { wch: 8 },  // Status
        { wch: 10 }  // Time
      ];

      xlsxUtils.book_append_sheet(wb, ws, `Attendance-${year}-${month}`);
      xlsxWriteFile(wb, `Attendance_Report_${year}_${month}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      setError('Failed to export attendance data');
    }
  };

  useEffect(() => {
    if (token) {
      fetchEmployees();
    } else {
      setError("No access token found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAttendanceData();
    }
  }, [selectedMonth, token]);

  const renderAttendanceTable = () => {
    if (!employees.length || !attendanceData) return null;

    const [year, month] = selectedMonth.split('-');
    const daysInMonth = Array.from(
      { length: monthInfo.days_in_month }, 
      (_, i) => i + 1
    );

    return (
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Monthly Attendance</h2>
            <button
              onClick={exportToExcel}
              className="inline-flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-all duration-300 text-sm"
            >
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export to Excel
            </button>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              max={new Date().toISOString().slice(0, 7)}
              className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
            />
            {error && (
              <span className="text-red-500 text-sm">{error}</span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border border-gray-200 text-left sticky left-0 bg-gray-100 z-10">
                  Employee
                </th>
                {daysInMonth.map(day => (
                  <th key={day} className="p-3 border border-gray-200 min-w-[80px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.unique_id}>
                  <td className="p-3 border border-gray-200 sticky left-0 bg-white z-10">
                    {employee.name}
                  </td>
                  {daysInMonth.map(day => {
                    const date = formatDate(year, month, day);
                    const record = attendanceData.find(
                      record => record.employee_id === employee.unique_id && 
                               record.date === date
                    );
                    
                    // Debug log for matching records
                    console.log('Checking attendance match:', {
                      employeeId: employee.unique_id,
                      date,
                      found: !!record,
                      record
                    });
                    
                    const statusColors = {
                      'P': 'text-green-600',
                      'A': 'text-red-600',
                      'L': 'text-yellow-600',
                      '-': 'text-gray-400'
                    };

                    return (
                      <td 
                        key={`${employee.unique_id}-${day}`}
                        className={`p-3 border border-gray-200 text-center font-medium ${
                          statusColors[record?.status || '-']
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span>{record?.status || '-'}</span>
                          {record?.timestamp && (
                            <span className="text-xs text-gray-500">
                              {record.timestamp}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const PaginationControls = () => (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
      <p className="text-sm text-gray-600">
        Showing {pagination.currentPage * pagination.pageSize - pagination.pageSize + 1} to{" "}
        {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalEmployees)} of{" "}
        {pagination.totalEmployees} employees
      </p>
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => fetchEmployees(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg
            text-gray-700 bg-white border border-gray-300 hover:bg-gray-50
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => fetchEmployees(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg
            text-gray-700 bg-white border border-gray-300 hover:bg-gray-50
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-6">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-gray-100">
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-gray-100 text-gray-900 p-4 rounded-xl mb-6 border border-gray-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Employees in {orgName}
            </h1>
            {employees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="p-4 text-left text-gray-700 font-semibold">Name</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Email</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Unique ID</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Date Joined</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Attendance</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Photo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employees.map((employee) => (
                      <tr 
                        key={employee.id} 
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="p-4 text-gray-800">{employee.name}</td>
                        <td className="p-4 text-gray-800">{employee.email}</td>
                        <td className="p-4 text-gray-800">{employee.unique_id}</td>
                        <td className="p-4 text-gray-800">
                          {new Date(employee.date_joined).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <Link
                            to="/monthlyAttendance"
                            state={{ employee }}
                            className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-all duration-300 text-sm"
                          >
                            View Attendance
                          </Link>
                        </td>
                        <td className="p-4">
                          {employee.photo ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200">
                              <img
                                src={`http://127.0.0.1:8000${employee.photo}`}
                                alt={employee.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                              <span className="text-gray-400">No photo</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No employees found.</p>
              </div>
            )}
            {employees.length > 0 && <PaginationControls />}
            {renderAttendanceTable()}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageEmployee;

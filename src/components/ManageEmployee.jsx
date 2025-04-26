import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { utils as xlsxUtils, writeFile as xlsxWriteFile } from "xlsx";

// AttendanceTable Component
const AttendanceTable = ({ loading, error, attendanceData }) => {
  return (
    <div>
      <h3>Attendance Records</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData && Object.keys(attendanceData).length > 0 ? (
            Object.entries(attendanceData).map(([date, records]) =>
              records.map((record, index) => (
                <tr key={`${date}-${index}`}>
                  <td>{date}</td>
                  <td>{record.employeeName}</td>
                  <td>{record.time}</td>
                  <td>{record.status}</td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="4">No attendance data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Use an object to store attendance data keyed by date
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM format
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalEmployees: 0,
  });
  const [monthInfo, setMonthInfo] = useState({ days_in_month: 31 });

  const token = localStorage.getItem("access_token");

  // Helper function to format date in YYYY-MM-DD
  const formatDate = (year, month, day) => {
    return `${year}-${month.padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  };

  // Fetch employees for the authenticated organization
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
        totalEmployees: data.total,
      });

      // Fetch organization name from dashboard API
      const dashboardResponse = await fetch("http://127.0.0.1:8000/api/org/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
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

// In your fetchAttendanceData function:

const fetchAttendanceData = async () => {
  try {
    const [year, month] = selectedMonth.split("-");
    setLoading(true);
    setError(null);

    const response = await axios.get(
      `http://localhost:8000/api/emp/attendance/monthly/${year}/${month}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Assume response.data is an array
    console.log("Raw API Response:", response.data);

    // Transform data so that keys match what your table expects
    const formattedData = {};
    response.data.forEach((record) => {
      const recordDate = record.date; // date in format "YYYY-MM-DD"
      if (!formattedData[recordDate]) {
        formattedData[recordDate] = [];
      }
      formattedData[record.date].push({
        employeeId:   record.employee_unique_id,
        employeeName: record.employee_name,
        checkIn:      record.check_in   || "",
        checkOut:     record.check_out  || "",
        status:       record.status,
      });
    });
      
    console.log("Formatted Attendance Data:", formattedData);
    setAttendanceData(formattedData);
  } catch (error) {
    console.error("Fetch error:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleMonthChange = (e) => {
    const newDate = e.target.value;
    if (!newDate) return;

    const [year, month] = newDate.split("-");
    const currentDate = new Date();
    const selectedDate = new Date(year, month - 1);
    if (selectedDate > currentDate) {
      setError("Cannot select future dates");
      return;
    }
    setSelectedMonth(newDate);
    setError(null);
  };

  // Updated exportToExcel function to match table layout
  const exportToExcel = () => {
    try {
      const [year, month] = selectedMonth.split("-");
      const numDays =
        monthInfo.days_in_month || new Date(year, month, 0).getDate();
      const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);
  
      // Prepare header row
      const headerRow = [
        "Employee",
        ...daysArray.map((day) =>
          `${year}-${month.padStart(2, "0")}-${String(day).padStart(2, "0")}`
        ),
      ];
  
      // Build rows
      const dataRows = employees.map((employee) => {
        const row = [employee.name];
        const today = new Date().toISOString().slice(0, 10);
  
        daysArray.forEach((day) => {
          const date = formatDate(year, month, day);
          const record = attendanceData[date]?.find(
            (rec) => rec.employeeId === employee.unique_id
          );
  
          if (record) {
            // Compose "<STATUS> <CHECK_IN>-<CHECK_OUT>"
            const times = [];
            if (record.checkIn) times.push(record.checkIn);
            if (record.checkOut) times.push(record.checkOut);
            const timePart = times.length ? times.join("–") : "";
            row.push(`${record.status}${timePart ? " " + timePart : ""}`);
          } else {
            // Past dates without record => "A", future => "-"
            row.push(date < today ? "A" : "-");
          }
        });
  
        return row;
      });
  
      // Combine and write
      const wsData = [headerRow, ...dataRows];
      const wb = xlsxUtils.book_new();
      const ws = xlsxUtils.aoa_to_sheet(wsData);
      ws["!cols"] = [
        { wch: 20 },
        ...daysArray.map(() => ({ wch: 18 })), // a bit wider for the two times
      ];
  
      xlsxUtils.book_append_sheet(
        wb,
        ws,
        `Attendance-${year}-${month}`
      );
      xlsxWriteFile(
        wb,
        `Attendance_Report_${year}_${month}.xlsx`
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setError("Failed to export attendance data");
    }
  };
  

  const renderAttendanceTable = () => {
    if (loading) return <div className="text-center py-4">Loading attendance data...</div>;
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
    if (!employees.length) return null;

    const [year, month] = selectedMonth.split("-");
    const daysInMonth = Array.from(
      { length: monthInfo.days_in_month },
      (_, i) => i + 1
    );

    return (
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Attendance Record</h2>
            <div className="flex gap-4">
              <input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                max={new Date().toISOString().slice(0, 7)}
                className="border rounded px-3 py-2"
              />
              <button
                onClick={exportToExcel}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Export to Excel
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Employee
                </th>
                {daysInMonth.map((day) => (
                  <th
                    key={day}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.unique_id}>
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                    {employee.name}
                  </td>
                  {daysInMonth.map((day) => {
                    const date = formatDate(year, month, day);
                    const record = attendanceData[date]?.find(
                      (rec) => rec.employeeId === employee.unique_id
                    );
                    return (
                      <td key={`${employee.unique_id}-${day}`} className="px-6 py-4 text-center">
                        <div className={`
                            ${record?.status === "P" && "text-green-600"}
                            ${record?.status === "A" && "text-red-600"}
                            ${record?.status === "L" && "text-yellow-600"}
                        `}>
                          <div>{record?.status || "-"}</div>
                          <div className="text-xs text-gray-500">
                            {record?.checkIn  && <>In: {record.checkIn}</>}
                          </div>
                          <div className="text-xs text-gray-500">
                            {record?.checkOut && <>Out: {record.checkOut}</>}
                          </div>
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
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => fetchEmployees(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  );

  useEffect(() => {
    if (token) {
      fetchEmployees();
    } else {
      setError("No access token found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAttendanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-6">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-gray-100">
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
                      <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
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

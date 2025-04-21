import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MonthlyAttendance = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!employee) {
      navigate("/manageEmployee");
      return;
    }
    fetchAttendanceData();
  }, [selectedMonth, employee]);

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

      // Log raw API response for debugging
      console.log("Raw API Response:", response.data);

      // Transform data so that keys match what your table expects
      const formattedData = {};
      response.data.forEach((record) => {
        const recordDate = record.date; // date in format "YYYY-MM-DD"
        if (!formattedData[recordDate]) {
          formattedData[recordDate] = [];
        }
        formattedData[recordDate].push({
          employeeId: record.employee_unique_id,
          employeeName: record.employee_name,
          time: record.check_in ? record.check_in : "",
          status: record.status,
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

  const markAttendance = async (status) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/emp/attendance/mark/${employee.id}/${status}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        // Refresh the attendance data
        fetchAttendanceData();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setError(error.message || "Failed to mark attendance");
    }
  };

  const StatusButton = ({ status, label, colorClass }) => (
    <button
      onClick={() => markAttendance(status)}
      className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${colorClass}`}
    >
      Mark as {label}
    </button>
  );

  const getDaysInMonth = (yearMonth) => {
    const [year, month] = yearMonth.split("-");
    return new Date(year, month, 0).getDate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-6">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monthly Attendance</h1>
            <p className="text-gray-600 mt-2">Employee: {employee?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border border-gray-200 rounded-lg"
            />
            <button
              onClick={() => navigate("/manageEmployee")}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-all duration-300"
            >
              Back to Employees
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <StatusButton 
            status="P" 
            label="Present" 
            colorClass="bg-green-600 hover:bg-green-700" 
          />
          <StatusButton 
            status="A" 
            label="Absent" 
            colorClass="bg-red-600 hover:bg-red-700" 
          />
          <StatusButton 
            status="L" 
            label="Leave" 
            colorClass="bg-yellow-600 hover:bg-yellow-700" 
          />
          <StatusButton 
            status="H" 
            label="Half Day" 
            colorClass="bg-blue-600 hover:bg-blue-700" 
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-gray-100 text-gray-900 p-4 rounded-xl mb-6 border border-gray-200">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border border-gray-200 text-gray-700 font-semibold">Date</th>
                  <th className="p-3 border border-gray-200 text-gray-700 font-semibold">Status</th>
                  <th className="p-3 border border-gray-200 text-gray-700 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1).map((day) => {
                  const date = `${selectedMonth}-${String(day).padStart(2, "0")}`;
                  // Attendance data is keyed by date (and stored as an array for that date)
                  const recordsForDate = attendanceData[date] || [];
                  const attendance = recordsForDate.find(
                    (rec) => rec.employeeId === employee.unique_id
                  );
                  
                  return (
                    <tr key={date} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-200 text-gray-800">
                        {new Date(date).toLocaleDateString()}
                      </td>
                      <td 
                        className={`p-3 border border-gray-200 text-center font-medium ${
                          attendance?.status === "P" ? "text-green-600" : 
                          attendance?.status === "A" ? "text-red-600" : 
                          attendance?.status === "L" ? "text-yellow-600" :
                          attendance?.status === "H" ? "text-blue-600" : "text-gray-400"
                        }`}
                      >
                        {attendance?.status || "-"}
                      </td>
                      <td className="p-3 border border-gray-200 text-gray-800">
                        {attendance?.time || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyAttendance;
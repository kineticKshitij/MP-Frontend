import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Add this import

const MonthlyAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
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
      const [year, month] = selectedMonth.split('-');
      const response = await axios.get(
        `http://127.0.0.1:8000/api/emp/attendance/${year}/${month}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendanceData(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Failed to fetch attendance data");
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

      if (response.data.status === 'success') {
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
    const [year, month] = yearMonth.split('-');
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
                  const date = `${selectedMonth}-${String(day).padStart(2, '0')}`;
                  const attendance = attendanceData.find(a => a.date === date);
                  
                  return (
                    <tr key={date} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-200 text-gray-800">
                        {new Date(date).toLocaleDateString()}
                      </td>
                      <td className={`p-3 border border-gray-200 text-center font-medium
                        ${attendance?.status === 'P' ? 'text-green-600' : 
                          attendance?.status === 'A' ? 'text-red-600' : 
                          attendance?.status === 'L' ? 'text-yellow-600' : 'text-gray-400'}`}>
                        {attendance?.status || '-'}
                      </td>
                      <td className="p-3 border border-gray-200 text-gray-800">
                        {attendance?.timestamp ? new Date(attendance.timestamp).toLocaleTimeString() : '-'}
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
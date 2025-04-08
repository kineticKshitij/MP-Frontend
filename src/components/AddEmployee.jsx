import React, { useState, useEffect } from "react";
import axios from "axios";

const AddEmployee = () => {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uniqueId, setUniqueId] = useState(""); // Custom Employee ID
  const [rfid, setRfid] = useState(""); // Optional RFID field
  const [photo, setPhoto] = useState(null);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgData");
    if (storedOrg) {
      const org = JSON.parse(storedOrg);
      setCompany(org.name);
    }
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    // Get JWT token from localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError("Please login first!");
      return;
    }
  
    if (parseInt(captcha.answer, 10) !== captcha.num1 + captcha.num2) {
      setError("Incorrect CAPTCHA answer!");
      generateCaptcha();
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("unique_id", uniqueId);
    formData.append("org_name", company);
    formData.append("photo", photo);
    if (rfid) formData.append("rfid", rfid);
  
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/emp/add-employee/${company}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`  // Add JWT token here
          }
        }
      );
      setSuccess(response.data.message);
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setUniqueId("");
      setRfid("");
      setPhoto(null);
      generateCaptcha();
    } catch (err) {
      console.error("Error adding employee:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError(err.response?.data?.message || "Error adding employee. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 max-w-md w-full border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Add Employee</h2>
        
        {error && (
          <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-xl mb-4 border border-gray-200">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-xl mb-4 border border-gray-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Employee Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Employee Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Employee ID (Custom)</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">RFID Card ID (Optional)</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50"
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Upload Photo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="photo-upload"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
              <label 
                htmlFor="photo-upload"
                className="cursor-pointer text-gray-600 hover:text-gray-900 transition-all duration-300"
              >
                Click to upload or use camera
              </label>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-gray-700 font-medium mb-2">
              CAPTCHA: <span className="font-bold">{captcha.num1} + {captcha.num2} = ?</span>
            </p>
            <input
              type="number"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none bg-white"
              value={captcha.answer}
              onChange={(e) => setCaptcha({ ...captcha, answer: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white p-3 rounded-xl hover:bg-black transition-all duration-300 shadow-sm hover:shadow-xl"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;

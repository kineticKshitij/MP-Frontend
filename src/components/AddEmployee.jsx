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

    if (parseInt(captcha.answer, 10) !== captcha.num1 + captcha.num2) {
      setError("Incorrect CAPTCHA answer!");
      generateCaptcha();
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("unique_id", uniqueId); // Custom Employee ID
    formData.append("org_name", company);
    formData.append("photo", photo);
    if (rfid) formData.append("rfid", rfid); // RFID is optional

    try {
      console.log("Form Data:", formData); // Log the form data for debugging
      const response = await axios.post(
        `http://127.0.0.1:8000/api/emp/add-employee/${company}/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSuccess(response.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setUniqueId(""); // Clear Employee ID
      setRfid(""); // Clear RFID field
      setPhoto(null);
      generateCaptcha();
    } catch (err) {
      console.error("Error adding employee:", err);
      setError(
        err.response?.data?.error || "Error adding employee. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Add Employee</h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Employee Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Employee Email
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Employee ID (Custom)
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              RFID Card ID (Optional)
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Photo
            </label>
            <input
            type="file"
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <p className="text-sm text-gray-500 mt-1">
            You can use your camera or browse from your device.
          </p>

          </div>
          <div>
            <p className="text-gray-700 font-medium">
              CAPTCHA: {captcha.num1} + {captcha.num2} = ?
            </p>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={captcha.answer}
              onChange={(e) =>
                setCaptcha({ ...captcha, answer: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { sendOTP } from "./Email";

const Signup = () => {
  const { register, handleSubmit, watch } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [logo, setLogo] = useState(null);
  const password = watch("password");

  useEffect(() => {
    setNum1(Math.floor(10 + Math.random() * 90));
    setNum2(Math.floor(10 + Math.random() * 90));
  }, []);

  const captcha = `${num1} + ${num2}`;
  const correctCaptcha = num1 + num2;

  const handleSendOTP = async () => {
    if (!email) {
      alert("Please enter an email first.");
      return;
    }
    const success = await sendOTP(email.trim().toLowerCase());
    if (success) {
      setOtpSent(true);
      alert("OTP sent to your email.");
    }
  };

  const onSubmit = async (data) => {
    const storedOtp = localStorage.getItem("otp")?.trim();
    if (userOtp !== storedOtp) {
      alert("Invalid OTP.");
      return;
    }
    if (parseInt(captchaInput, 10) !== correctCaptcha) {
      alert("Incorrect captcha.");
      return;
    }
    if (data.password !== data.rePassword) {
      alert("Passwords do not match.");
      return;
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email.trim().toLowerCase());
    formData.append("password", data.password);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/org/signup/", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        // Optionally, redirect or clear the form here.
      } else {
        alert(result.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Organization Name" 
          {...register("name", { required: true })} 
          className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50"
        />
        
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50"
          />
          <button 
            type="button" 
            onClick={handleSendOTP}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-all duration-300"
          >
            Send OTP
          </button>
        </div>

        {otpSent && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="password" 
                placeholder="Password" 
                {...register("password", { required: true })}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50"
              />
              <input 
                type="password" 
                placeholder="Re-enter Password" 
                {...register("rePassword", { required: true })}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50"
              />
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setLogo(e.target.files[0])} 
                className="hidden"
                id="logo-upload"
              />
              <label 
                htmlFor="logo-upload"
                className="cursor-pointer text-gray-600 hover:text-gray-900 transition-all duration-300"
              >
                Upload Organization Logo
              </label>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-2">Captcha: <span className="font-medium text-gray-900">{captcha}</span></p>
              <input
                type="text"
                placeholder="Enter Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none bg-white"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-black transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default Signup;

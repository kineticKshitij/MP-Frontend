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
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <input type="text" placeholder="Name" {...register("name", { required: true })} />
      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="button" onClick={handleSendOTP}>
        Send OTP
      </button>
      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={userOtp}
            onChange={(e) => setUserOtp(e.target.value)}
          />
          <input type="password" placeholder="Password" {...register("password", { required: true })} />
          <input type="password" placeholder="Re-enter Password" {...register("rePassword", { required: true })} />
          <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />
          <p>Captcha: {captcha}</p>
          <input
            type="text"
            placeholder="Enter Captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />
          <button type="submit">Signup</button>
        </>
      )}
    </form>
  );
};

export default Signup;

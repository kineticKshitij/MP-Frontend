import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "./Email";

const Signin = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setNum1(Math.floor(10 + Math.random() * 90));
    setNum2(Math.floor(10 + Math.random() * 90));
  };

  const correctCaptcha = num1 + num2;
  const captchaQuestion = `${num1} + ${num2}`;

  const sendOTPHandler = async () => {
    if (!email.trim()) {
      alert("Please enter a valid email.");
      return;
    }

    const success = await sendOTP(email.trim().toLowerCase());
    if (success) {
      setOtpSent(true);
      alert("OTP sent to your email.");
    } else {
      alert("Failed to send OTP. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    const storedOtp = localStorage.getItem("otp")?.trim();
    if (!userOtp || userOtp.trim() !== storedOtp) {
      alert("Invalid OTP.");
      return;
    }

    if (parseInt(captchaInput, 10) !== correctCaptcha) {
      alert("Incorrect CAPTCHA.");
      generateCaptcha();
      return;
    }

    try {
      // Send login request to the JWT endpoint
      const response = await fetch("http://127.0.0.1:8000/api/org/login/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: data.password,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Signin successful!");
        // Store JWT tokens in localStorage
        localStorage.setItem("access_token", result.access);
        localStorage.setItem("refresh_token", result.refresh);
        // Optionally store organization data
        localStorage.setItem("orgData", JSON.stringify(result.organization));
        navigate("/OrgDash");
      } else {
        alert(result.error || "Signin failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signin:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
        onChange={(e) => {
          setEmail(e.target.value);
          setValue("email", e.target.value);
        }}
        value={email}
      />
      <button type="button" onClick={sendOTPHandler} disabled={otpSent}>
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
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          <p>Captcha: {captchaQuestion}</p>
          <input
            type="text"
            placeholder="Enter Captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />
          <button type="submit">Signin</button>
        </>
      )}
    </form>
  );
};

export default Signin;

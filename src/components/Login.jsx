import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "./Email";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });

  const generateCaptcha = () => {
    const num1 = Math.floor(10 + Math.random() * 90);
    const num2 = Math.floor(10 + Math.random() * 90);
    setCaptcha({ question: `${num1} + ${num2}`, answer: num1 + num2 });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const sendOTPHandler = async () => {
    if (!email) {
      alert("Please enter an email.");
      return;
    }
    const success = await sendOTP(email);
    if (success) {
      setOtpSent(true);
      generateCaptcha();
    }
  };

  const onSubmit = async (data) => {
    const storedOtp = localStorage.getItem("otp");
    if (!userOtp || userOtp !== storedOtp) {
      alert("Invalid OTP.");
      return;
    }
    if (parseInt(captchaInput) !== captcha.answer) {
      alert("Incorrect captcha.");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/emp/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Signin successful!");
        // Store employee JWT tokens if returned (if using similar JWT flow)
        // For example: localStorage.setItem("access_token", result.access);
        navigate("/EmpDash");
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
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="button" onClick={sendOTPHandler}>
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
          <p>Captcha: {captcha.question}</p>
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

export default Login;

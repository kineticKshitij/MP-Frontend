import React, { useState } from "react";
import Login from "./Login";
import SignIn from "./Signin";
import SignUp from "./Signup";

const AuthContainer = () => {
  const [activeForm, setActiveForm] = useState("login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-[480px] border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6 border-b border-gray-200 pb-4">
          Welcome Back!
        </h2>

        <div className="flex justify-around mb-8 bg-gray-100 p-1.5 rounded-xl">
          <button
            className={`px-6 py-2.5 font-medium rounded-lg transition-all duration-300 ${
              activeForm === "login"
                ? "bg-gray-900 text-white shadow-md"
                : "bg-transparent text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveForm("login")}
          >
            Login
          </button>
          <button
            className={`px-6 py-2.5 font-medium rounded-lg transition-all duration-300 ${
              activeForm === "signin"
                ? "bg-gray-900 text-white shadow-md"
                : "bg-transparent text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveForm("signin")}
          >
            Sign In
          </button>
          <button
            className={`px-6 py-2.5 font-medium rounded-lg transition-all duration-300 ${
              activeForm === "signup"
                ? "bg-gray-900 text-white shadow-md"
                : "bg-transparent text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveForm("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {activeForm === "login" && <Login />}
          {activeForm === "signin" && <SignIn />}
          {activeForm === "signup" && <SignUp />}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;

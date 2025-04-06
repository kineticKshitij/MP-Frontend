import React, { useState } from "react";
import Login from "./Login";
import SignIn from "./Signin";
import SignUp from "./Signup";

const AuthContainer = () => {
  const [activeForm, setActiveForm] = useState("login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96 transform transition-all duration-500 scale-105 hover:scale-110">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4 animate-fade-in">
          Welcome Back!
        </h2>

        <div className="flex justify-around mb-6">
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition ${
              activeForm === "login"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveForm("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition ${
              activeForm === "signin"
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveForm("signin")}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition ${
              activeForm === "signup"
                ? "bg-purple-500 text-white shadow-md"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveForm("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="transition-opacity duration-300 ease-in-out animate-fade-in">
          {activeForm === "login" && <Login />}
          {activeForm === "signin" && <SignIn />}
          {activeForm === "signup" && <SignUp />}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;

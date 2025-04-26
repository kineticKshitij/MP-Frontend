import React, { useState } from "react";
import Login from "./Login";
import Signin from "./Signin";
import Signup from "./Signup";

const AuthContainer = () => {
  // Primary tabs: "employee" or "organization"
  const [activeTab, setActiveTab] = useState("employee");
  // For organization sub-tabs: "signin" or "signup"
  const [orgTab, setOrgTab] = useState("signin");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-4">
      <div className="bg-white border-2 border-black rounded-lg shadow-2xl w-full max-w-[750px] overflow-hidden">
        {/* Primary Tab Controls */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("employee")}
            className={`flex-1 py-4 text-center font-bold ${
              activeTab === "employee"
                ? "bg-black text-white"
                : "bg-white text-black"
            } transition-colors duration-500`}
          >
            Employee
          </button>
          <button
            onClick={() => setActiveTab("organization")}
            className={`flex-1 py-4 text-center font-bold ${
              activeTab === "organization"
                ? "bg-black text-white"
                : "bg-white text-black"
            } transition-colors duration-500`}
          >
            Organization
          </button>
        </div>
        <div className="p-8">
          {activeTab === "employee" ? (
            <div
              key="employee"
              className="transition-opacity duration-500 ease-in-out opacity-100"
            >
              <h2 className="text-center text-2xl font-bold mb-4">
                Employee Login
              </h2>
              <Login />
            </div>
          ) : (
            <div
              key="organization"
              className="transition-opacity duration-500 ease-in-out opacity-100"
            >
              {/* Organization Sub-Tab Controls */}
              <div className="flex mb-4 transition-colors duration-500">
                <button
                  onClick={() => setOrgTab("signin")}
                  className={`flex-1 py-2 text-center font-semibold ${
                    orgTab === "signin"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  Signin
                </button>
                <button
                  onClick={() => setOrgTab("signup")}
                  className={`flex-1 py-2 text-center font-semibold ${
                    orgTab === "signup"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  Signup
                </button>
              </div>
              <div className="transition-opacity duration-500 ease-in-out opacity-100">
                {orgTab === "signin" && <Signin />}
                {orgTab === "signup" && <Signup />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;

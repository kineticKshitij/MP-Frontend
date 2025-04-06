import React from "react";

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Services</h1>
        <p className="text-lg text-gray-600 text-center mb-6">Here is our research paper:</p>
        <div className="w-full">
          <iframe
            src="https://docs.google.com/document/d/1IVIxMxNXzksutAv3tZdGflGL41C-vE_GR5I6-aYogd0/edit?usp=sharing"
            width="100%"
            height="600px"
            className="border rounded-lg shadow-md"
            title="Research Paper"
          />
        </div>
      </div>
    </div>
  );
};

export default About;

import React, { useState, useEffect } from "react";

const Contact = () => {
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [publicQueries, setPublicQueries] = useState([]);

  useEffect(() => {
    // Fetch public queries from the backend (adjust API endpoint as needed)
    fetch("/api/public_queries")
      .then((response) => response.json())
      .then((data) => setPublicQueries(data))
      .catch((error) => console.error("Error fetching queries:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/submit_query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, visibility }),
    });

    if (response.ok) {
      alert("Query submitted successfully!");
      setQuery("");
      // Refresh public queries if it was public
      if (visibility === "public") {
        const updatedQueries = await response.json();
        setPublicQueries(updatedQueries);
      }
    } else {
      alert("Failed to submit query.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-6">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 max-w-3xl w-full border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
          Submit Your Query
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Your Query:
            </label>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50 text-gray-900 resize-none"
              rows="4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Visibility:
            </label>
            <div className="flex space-x-6 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                  className="text-gray-900 focus:ring-gray-300"
                />
                <span className="text-gray-700">Public</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                  className="text-gray-900 focus:ring-gray-300"
                />
                <span className="text-gray-700">Private</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gray-900 text-white p-3 rounded-xl hover:bg-black transition-all duration-300 shadow-sm hover:shadow-xl"
          >
            Submit Query
          </button>
        </form>

        {publicQueries.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Public Queries
            </h3>
            <div className="space-y-3">
              {publicQueries.map((q, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <p className="text-gray-800">{q.query}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(q.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {publicQueries.length === 0 && (
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500">No public queries available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;

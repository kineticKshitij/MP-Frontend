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
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/static/bk.png')" }}>
      <div className="bg-black bg-opacity-50 p-6 rounded-lg w-2/3 text-white shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-4">Submit Your Query</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg">Your Query:</label>
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-500"
              rows="4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-lg">Visibility:</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                  className="mr-2"
                />
                Public
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                  className="mr-2"
                />
                Private
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
            Submit
          </button>
        </form>

        <h3 className="text-center text-xl font-semibold mt-6">Public Queries</h3>
        {publicQueries.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {publicQueries.map((q, index) => (
              <li key={index} className="bg-gray-800 p-2 rounded">
                {q.query} - <em className="text-sm text-gray-400">{q.created_at}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center mt-4 text-gray-300">No public queries available.</p>
        )}
      </div>
    </div>
  );
};

export default Contact;

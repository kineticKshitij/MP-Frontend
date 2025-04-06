import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyABuoxSgHX7cAPn2JS0g9pzAsEPF98zOF0");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const result = await model.generateContent(input);
      let responseText = result.response.text();

      // Trim the response to a maximum of 30 words
      responseText = responseText.split(" ").slice(0, 30).join(" ") + (responseText.split(" ").length > 30 ? "..." : "");

      const botMessage = { text: responseText, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setMessages((prev) => [...prev, { text: "Sorry, something went wrong.", sender: "bot" }]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end">
      {/* Chat Toggle Button */}
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-xl hover:bg-blue-600 transition-all" 
        onClick={() => setIsOpen(!isOpen)}
      >
        💬 Chat
      </button>

      {isOpen && (
        <div className="w-80 bg-white shadow-2xl rounded-xl mt-3 p-4 border border-gray-200">
          {/* Chat Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-bold text-gray-700">AI Chatbot</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-xl max-w-xs ${msg.sender === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-black self-start"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex mt-3 border-t pt-2">
            <input 
              type="text" 
              className="flex-1 border rounded-l-xl p-2 outline-none focus:ring-2 focus:ring-blue-300" 
              placeholder="Type a message..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              className="bg-blue-500 text-white px-4 rounded-r-xl hover:bg-blue-600 transition-all" 
              onClick={sendMessage}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

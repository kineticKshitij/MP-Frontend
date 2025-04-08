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
        className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl hover:bg-black transition-all duration-300" 
        onClick={() => setIsOpen(!isOpen)}
      >
        💬 Chat
      </button>

      {isOpen && (
        <div className="w-80 bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl mt-3 p-4 border border-gray-100">
          {/* Chat Header */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h2 className="text-lg font-bold text-gray-900">AI Chatbot</h2>
            <button 
              className="text-gray-600 hover:text-gray-900 transition-all duration-300"
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
                className={`p-3 rounded-xl max-w-xs ${
                  msg.sender === "user" 
                    ? "bg-gray-900 text-white self-end ml-auto" 
                    : "bg-gray-100 text-gray-900 self-start border border-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex mt-3 border-t border-gray-200 pt-2">
            <input 
              type="text" 
              className="flex-1 border border-gray-200 rounded-l-xl p-2 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50" 
              placeholder="Type a message..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              className="bg-gray-900 text-white px-4 rounded-r-xl hover:bg-black transition-all duration-300" 
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

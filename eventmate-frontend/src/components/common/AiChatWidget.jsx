import React, { useState } from 'react';

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">EventMate AI 🤖</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">✕</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-700 max-w-[80%] mb-2">
              Hello! I can help you find events near you. Try asking "Techno parties in Berlin".
            </div>
            {/* User message placeholder */}
            <div className="bg-blue-600 p-3 rounded-lg rounded-tr-none shadow-sm text-sm text-white max-w-[80%] ml-auto mb-2">
              Suggest me events for this weekend.
            </div>
          </div>
          <div className="p-3 border-t bg-white flex gap-2">
            <input type="text" placeholder="Ask AI..." className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="bg-blue-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center">➤</button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center w-14 h-14"
      >
        💬
      </button>
    </div>
  );
};

export default AiChatWidget;
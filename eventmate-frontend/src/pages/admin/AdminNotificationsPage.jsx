import React, { useState } from 'react';

const AdminNotificationsPage = () => {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All");

  const handleSend = (e) => {
    e.preventDefault();
    alert(`📢 Announcement sent to [${audience}]: "${message}"`);
    setMessage("");
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Announcements</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSend}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Target Audience</label>
            <select 
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Users</option>
              <option value="Organizers">Organizers Only</option>
              <option value="VIP">VIP Users</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              placeholder="Type your announcement here..."
              className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            🚀 Send Notification
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Recent Announcements</h3>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm text-gray-600">
          <strong>To All:</strong> "Welcome to the new EventMate dashboard!" (Sent 2 days ago)
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
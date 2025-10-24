import React, { useState } from 'react';

export default function InboxViewer({ backend, email }) {
  const [messages, setMessages] = useState([]);

  const fetchInbox = async () => {
    try {
      const res = await fetch(`${backend}/api/messages?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      alert('Inbox fetch error: ' + err.message);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={fetchInbox}
        className="bg-purple-500 text-white p-2 rounded hover:scale-105 transition-transform"
      >
        Show Inbox
      </button>
      <ul className="mt-4 space-y-2">
        {messages.map(msg => (
          <li key={msg.id} className="p-2 border rounded bg-gray-100 hover:bg-purple-100 transition-colors">
            {msg.subject}
          </li>
        ))}
      </ul>
    </div>
  );
}

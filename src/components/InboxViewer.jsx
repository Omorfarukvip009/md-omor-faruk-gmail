import React, { useState } from 'react';

export default function InboxViewer({ backend, accessKey }) {
  const [messages, setMessages] = useState([]);

  const fetchInbox = async () => {
    try {
      const res = await fetch(`${backend}/api/messages?max=10`, {
        headers: { 'x-access-key': accessKey }
      });
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      alert('Inbox fetch error: ' + err.message);
    }
  };

  return (
    <div className="mt-8">
      <button onClick={fetchInbox} className="bg-purple-500 text-white p-2 rounded">
        Show Inbox
      </button>
      <ul className="mt-4 space-y-2">
        {messages.map(msg => (
          <li key={msg.id} className="p-2 border rounded bg-gray-50">
            <strong>{msg.from}</strong> | {msg.subject} | {msg.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

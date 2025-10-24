import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AccessKeyForm({ setHasAccess, setUserEmail }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch(`https://server-49hn.onrender.com/api/check-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (data.authenticated) {
        setStatus('Access granted');
        setUserEmail(email);
        setHasAccess(true);
      } else {
        setStatus('Access denied: Email not authenticated');
      }
    } catch (err) {
      setStatus('Server error: ' + err.message);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
    >
      <label className="text-lg font-medium">Enter Your Gmail:</label>
      <input
        type="email"
        placeholder="yourname@gmail.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:scale-105 transition-transform">
        Submit
      </button>
      {status && <p className="mt-2 text-red-500">{status}</p>}
    </motion.form>
  );
}

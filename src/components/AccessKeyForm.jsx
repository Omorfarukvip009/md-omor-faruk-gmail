import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AccessKeyForm({ setHasAccess }) {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (keyInput.trim() === 'FRK') {
      setHasAccess(true);
    } else {
      setError('Invalid access key');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
    >
      <label className="block mb-2 text-lg">Enter Access Key:</label>
      <input
        type="text"
        value={keyInput}
        onChange={e => setKeyInput(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </motion.form>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailGenerator() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(1);
  const [generated, setGenerated] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const generateEmails = () => {
    const variations = [];
    for (let i = 0; i < amount; i++) {
      const chars = email.split('').map(c => (Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()));
      variations.push(chars.join(''));
    }
    setGenerated(variations);
    setCurrentIndex(0);
    setCopied(false);
  };

  const handleCopyNext = () => {
    if (!generated[currentIndex]) return;
    navigator.clipboard.writeText(generated[currentIndex]);
    setCopied(true);

    setTimeout(() => {
      const next = currentIndex + 1;
      if (next < generated.length) {
        setCurrentIndex(next);
        setCopied(false);
      } else {
        setCurrentIndex(0);
        setGenerated([]);
        setCopied(false);
      }
    }, 500);
  };

  return (
    <div className="mt-6">
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 border rounded w-1/2"
        />
        <input
          type="number"
          min={1}
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="p-2 border rounded w-24"
        />
        <button
          onClick={generateEmails}
          className="bg-purple-500 text-white p-2 rounded hover:scale-105 transition-transform"
        >
          Generate
        </button>
      </div>

      <AnimatePresence>
        {generated[currentIndex] && (
          <motion.div
            key={generated[currentIndex]}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`mt-4 p-3 rounded-lg text-white font-mono ${copied ? 'bg-green-500' : 'bg-purple-600'}`}
          >
            {generated[currentIndex]}
            <button
              onClick={handleCopyNext}
              className="ml-4 bg-white text-purple-700 py-1 px-2 rounded hover:scale-105 transition-transform"
            >
              {copied ? 'Next' : 'Copy'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
        }

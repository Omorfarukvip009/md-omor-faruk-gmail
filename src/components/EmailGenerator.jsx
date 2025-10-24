import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailGenerator({ backend, accessKey }) {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(10);
  const [generated, setGenerated] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);

  const randomCase = s =>
    s.split('').map(c => /[a-zA-Z]/.test(c) ? (Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase()) : c).join('');

  const generateEmails = () => {
    const set = new Set();
    let attempts = 0;
    while (set.size < amount && attempts < 5000) {
      set.add(randomCase(email));
      attempts++;
    }
    return Array.from(set);
  };

  const handleGenerate = e => {
    e.preventDefault();
    if (!email || amount < 1) {
      setStatus('Enter valid email and amount');
      return;
    }
    const list = generateEmails();
    setGenerated(list);
    setCurrentIndex(0);
    setStatus('Generate success!');
    setCopied(false);
  };

  const handleCopyNext = async () => {
    if (!generated[currentIndex]) return;
    await navigator.clipboard.writeText(generated[currentIndex]);
    setCopied(true);
    setTimeout(() => {
      const next = currentIndex + 1;
      if (next < generated.length) {
        setCurrentIndex(next);
        setCopied(false);
      } else {
        setGenerated([]);
        setCurrentIndex(0);
        setCopied(false);
        setStatus('All emails used');
      }
    }, 300);
  };

  return (
    <motion.div className="mt-6">
      <form onSubmit={handleGenerate} className="flex gap-2 flex-wrap">
        <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="p-2 border rounded flex-1"/>
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(parseInt(e.target.value))} className="p-2 border rounded w-24"/>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Generate</button>
      </form>
      <p className="mt-2">{status}</p>

      <AnimatePresence>
        {generated[currentIndex] && (
          <motion.div
            key={generated[currentIndex]}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 p-2 border rounded ${copied ? 'bg-green-200' : 'bg-gray-100'}`}
          >
            {generated[currentIndex]}
            <button onClick={handleCopyNext} className="ml-2 bg-blue-500 text-white p-1 rounded">
              {copied ? 'Next' : 'Copy'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
      }
      

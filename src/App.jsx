import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND_ORIGIN = 'https://server-49hn.onrender.com';
const ACCESS_KEY = 'FRK';

export default function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [amountInput, setAmountInput] = useState('10');
  const [generated, setGenerated] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [inbox, setInbox] = useState([]);

  const checkKey = e => { e.preventDefault(); if (keyInput.trim() === ACCESS_KEY) setHasAccess(true); else setStatusMessage('Invalid key'); };

  const randomCaseVariant = s => s.split('').map(c => /[a-zA-Z]/.test(c) ? Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase() : c).join('');

  const generateVariants = (email, amount) => { const out = new Set(); email = email.trim(); if (!email || amount <= 0) return []; let attempts = 0, maxAttempts = Math.max(5000, amount * 50); while (out.size < amount && attempts < maxAttempts) { attempts++; out.add(randomCaseVariant(email)); } return Array.from(out); };

  const handleGenerate = e => { e && e.preventDefault(); setStatusMessage(''); setCopied(false); const amount = parseInt(amountInput, 10) || 0; if (!emailInput.trim()) { setStatusMessage('Enter email'); return; } if (amount <= 0 || amount > 10000) { setStatusMessage('Amount 1-10000'); return; } setStatusMessage('Generating...'); setTimeout(() => { const list = generateVariants(emailInput, amount); setGenerated(list); setCurrentIndex(0); setStatusMessage(list.length ? 'Generate success' : 'No variants'); }, 250); };

  const currentEmail = generated[currentIndex] || null;
  const copyCurrent = async () => { if (!currentEmail) return; await navigator.clipboard.writeText(currentEmail); setCopied(true); };

  const handleCopyButton = async () => { if (!copied) { await copyCurrent(); } else { const next = currentIndex + 1; if (next < generated.length) { setCurrentIndex(next); setCopied(false); } else { setGenerated([]); setCurrentIndex(0); setCopied(false); setStatusMessage('All used'); } } };

  const fetchInbox = async () => { try { const r = await fetch(`${BACKEND_ORIGIN}/api/messages?max=10`, { headers: { 'x-access-key': ACCESS_KEY } }); const j = await r.json(); if (j.messages) setInbox(j.messages); } catch (err) { alert('Inbox fetch error: ' + err.message); } };

  const openAuthWindow = async () => { try { const r = await fetch(`${BACKEND_ORIGIN}/auth/url`); const j = await r.json(); j.url && window.open(j.url, '_blank'); } catch (err) { alert('Auth error:' + err.message); } };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6">
        <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl font-semibold">Email Generator + Inbox</motion.h1>
        {!hasAccess ? (
          <form onSubmit={checkKey} className="mt-6">
            <label className="block text-sm font-medium mb-1">Enter Access Key</label>
            <input type="text" value={keyInput} onChange={e => setKeyInput(e.target.value)} className="border p-2 w-full rounded mb-2" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Submit</button>
            <p className="text-red-500 mt-2">{statusMessage}</p>
          </form>
        ) : (
          <></> // Full frontend content as provided earlier
        )}
      </div>
    </div>
  );
}

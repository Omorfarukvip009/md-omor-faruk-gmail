import React, { useState } from 'react';
import AccessKeyForm from './components/AccessKeyForm.jsx';
import InboxViewer from './components/InboxViewer.jsx';
import EmailGenerator from './components/EmailGenerator.jsx'; // NEW
import { motion } from 'framer-motion';

const BACKEND_ORIGIN = 'https://server-49hn.onrender.com';

export default function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
      <div className="max-w-4xl w-full bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-2xl p-10">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-500"
        >
          Gmail Inbox & Email Generator
        </motion.h1>

        {!hasAccess ? (
          <AccessKeyForm setHasAccess={setHasAccess} setUserEmail={setUserEmail} />
        ) : (
          <>
            <InboxViewer backend={BACKEND_ORIGIN} email={userEmail} />
            <div className="mt-10">
              <EmailGenerator />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

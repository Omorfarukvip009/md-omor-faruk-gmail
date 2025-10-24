import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AccessKeyForm from './components/AccessKeyForm.jsx';
import EmailGenerator from './components/EmailGenerator.jsx';
import InboxViewer from './components/InboxViewer.jsx';

const BACKEND_ORIGIN = 'https://server-49hn.onrender.com';
const ACCESS_KEY = 'FRK';

export default function App() {
  const [hasAccess, setHasAccess] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-center mb-6"
        >
          Gmail Email Generator & Inbox Viewer
        </motion.h1>

        {!hasAccess ? (
          <AccessKeyForm setHasAccess={setHasAccess} />
        ) : (
          <>
            <EmailGenerator backend={BACKEND_ORIGIN} accessKey={ACCESS_KEY} />
            <InboxViewer backend={BACKEND_ORIGIN} accessKey={ACCESS_KEY} />
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NewSessionTitle } from './ui/NewSessionTitle';
import { useSessionStore } from '../store/useSessionStore';

interface SessionCardProps {}

export function DashboardSession({}: SessionCardProps) {
  const { isSessionActive, resumeSession, isPaused, sessionName, setSessionName, startSession, tag } = useSessionStore();
  const [defaultSessionName, setDefaultSessionName] = useState(getDefaultSessionName());

  React.useEffect(() => {
    setDefaultSessionName(getDefaultSessionName());
  }, []);

  function getDefaultSessionName() {
    const currentHour = new Date().getHours();
    let timeOfDay = "";
    if (currentHour >= 5 && currentHour < 12) {
      timeOfDay = "Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      timeOfDay = "Afternoon";
    } else if (currentHour >= 17 && currentHour < 22) {
      timeOfDay = "Evening";
    } else {
      timeOfDay = "Midnight";
    }
    return `${timeOfDay} Session`;
  }

  const handleSaveSessionName = async (newSessionName: string) => {
    setSessionName(newSessionName);
    console.log("Session name updated:", newSessionName);
  };

  const handleStartSessionClick = async () => {
    console.log("DashboardSession: handleStartSessionClick called");
    if (isSessionActive && isPaused) {
      await resumeSession();
    } else if (!isSessionActive) {
      await startSession(tag || defaultSessionName);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center p-8 pb-4"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '600px', width: '100%' }} // Add max-width and width
    >
      <motion.div
        className="h-64 w-64 rounded-full bg-blue-200 m-4 shadow-md flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={handleStartSessionClick}
      >
        {/* Circle content or icon can go here */}
      </motion.div>
      <motion.div
        className="text-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <NewSessionTitle title={sessionName || defaultSessionName} onSave={handleSaveSessionName} />
      </motion.div>
    </motion.div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Check, Play, Loader2, Circle } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore'; // Import the store
import { DashboardSession } from '../components/DashboardSession';
import { DashboardGoal } from '../components/DashboardGoal';
import { motion } from 'framer-motion';

function HomePage() {

  return (
    <motion.div
      className="h-screen flex flex-col items-center p-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full">
        <DashboardSession />
      </div>
      <div className="w-full">
        <DashboardGoal />
      </div>
    </motion.div>
  );
}

export default HomePage;

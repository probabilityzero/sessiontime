import React from 'react';
import { motion } from 'framer-motion';
import { Image, ListChecks, Settings } from 'lucide-react';

interface ControlPanelNavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ControlPanelNavbar: React.FC<ControlPanelNavbarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="flex pb-0 p-1 border-b">
      <motion.button
        className={`p-1 ${activeSection === 'circleColor' ? 'bg-gray-200' : ''}`}
        onClick={() => setActiveSection('circleColor')}
        whileHover={{ scale: 1.1 }}  // Scale up on hover
        whileTap={{ scale: 0.95 }}   // Slightly scale down on click
        transition={{ duration: 0.3 }} // Smooth transition for scale
      >
        <Image className="w-5 h-5" />
      </motion.button>
      <motion.button
        className={`p-1 ${activeSection === 'emojiTag' ? 'bg-gray-200' : ''}`}
        onClick={() => setActiveSection('emojiTag')}
        whileHover={{ scale: 1.1 }}  // Scale up on hover
        whileTap={{ scale: 0.95 }}   // Slightly scale down on click
        transition={{ duration: 0.3 }} // Smooth transition for scale
      >
        <ListChecks className="w-5 h-5" />
      </motion.button>
      <motion.button
        className={`p-1 ${activeSection === 'recommendedSettings' ? 'bg-gray-200' : ''}`}
        onClick={() => setActiveSection('recommendedSettings')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Settings className="w-5 h-5" />
      </motion.button>
    </nav>
  );
};

export default ControlPanelNavbar;

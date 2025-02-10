import React, { useState, useRef, useEffect } from 'react';
import { PanelsTopLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CircleColorSettings from '../ui/ControlPanelBackground';
import ControlPanelTags from '../ui/ControlPanelTags';
import CalendarComponent from '../ui/ControlPanelCalendar';
import ControlPanelNavbar from '../ui/ControlPanelNavbar';
import { useUserSettingsStore } from '../../store/useUserSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import ControlPanelRecommended from '../ui/ControlPanelRecommended';

interface ControlPanelProps {
  onBackClick?: () => void; // Add onBackClick prop
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onBackClick }) => {
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('circleColor');
  const panelRef = useRef<HTMLDivElement>(null);
  const { fetchUserSettings, availableTags } = useUserSettingsStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    // Toggle panel open/close
    setIsControlPanelOpen(prev => !prev);

    if (!isControlPanelOpen && user) {
      setIsLoading(true);
      await fetchUserSettings(user.id);
      setIsLoading(false);
    }
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsControlPanelOpen(false);
      }
    };

    if (isControlPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isControlPanelOpen]);

  // Close the panel via the Back button
  const handleBackClick = () => {
    setIsControlPanelOpen(false);
  };

  return (
    <div className="relative p-1">
      {/* Button to open/close the panel */}
      <button
        className="text-gray-600 p-2 rounded-md focus:outline-none hover:bg-gray-100 active:bg-gray-200"
        onClick={handleClick}
      >
        <PanelsTopLeft className="h-6 w-6" />
      </button>

      {/* Use AnimatePresence to handle exit animations */}
      <AnimatePresence>
        {isControlPanelOpen && (
          <motion.div
            key="controlPanel"
            className="bg-white p-0 shadow-xl rounded-md w-80 overflow-hidden absolute top-0 right-0 flex flex-col"
            style={{ height: '100vh', zIndex: 50 }}
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}  // Animation for closing
            transition={{ duration: 0.3, ease: "easeInOut" }}
            ref={panelRef}
          >
            <div className="p-2 pb-0 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Control Panel</h3>

              {/* Back button to close the panel */}
              <button
                className="text-gray-600 p-1.5 rounded-md focus:outline-none hover:bg-gray-200 active:bg-gray-300"
                onClick={handleBackClick}
              >
                <ArrowRight className="h-5 w-5 stroke-[1]" />
              </button>
            </div>

            <div className="flex-grow flex flex-col overflow-y-auto p-2 pt-0">
              <ControlPanelNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
              {activeSection === 'circleColor' && <CircleColorSettings />}
              {activeSection === 'emojiTag' && <ControlPanelTags />}
              {activeSection === 'recommendedSettings' && <ControlPanelRecommended />}
            </div>

            <div className="p-4 border-t">
              <CalendarComponent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ControlPanel;

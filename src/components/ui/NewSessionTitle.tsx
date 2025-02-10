import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewSessionTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
}

export function NewSessionTitle({ title, onSave }: NewSessionTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (newTitle.trim().length > 0 && newTitle.length <= 26) {
      onSave(newTitle);
    } else {
      setNewTitle(title); // Revert to previous title
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 26) {
      setNewTitle(e.target.value);
    }
  };

  // Handle pressing Enter key to save
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveClick();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      handleSaveClick();
    }, 100); // Small delay
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        {isEditing ? (
          <div className="justify-between">
            <input
              type="text"
              ref={inputRef}
              value={newTitle}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="text-3xl font-semibold pr-4 text-center focus:outline-none bg-transparent"
              onBlur={handleBlur} // Save when focus is lost
            />
            <motion.button
              onClick={handleSaveClick}
              className="text-green-600 absolute bottom-1.5 hover:text-green-800 focus:outline-none right-0"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-4 w-4" />
            </motion.button>
          </div>
        ) : (
          <h2
            className="text-3xl font-semibold pr-4 cursor-pointer"
            onClick={handleTitleClick}
          >
            {title}
          </h2>
        )}
        <div className="fixed-width flex justify-center">
          <motion.div
            className="h-[2px] bg-blue-500"
            initial={{ width: '0%', scaleX: 0 }} // Start with scaleX at 0
            animate={{ width: isEditing ? '100%' : '0%', scaleX: isEditing ? 1 : 0 }} // Animate scaleX
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ originX: 0.5 }} // Set transform origin to center
          />
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import NewSessionTagPopover from '../ui/NewSessionTagPopover';
import { useUserSettingsStore } from '../../store/useUserSettingsStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useAuthStore } from '../../store/useAuthStore';

interface SessionTagProps {}

const SessionTag: React.FC<SessionTagProps> = ({}) => {
  const [isTagsPopoverOpen, setIsTagsPopoverOpen] = useState(false);
  const { availableTags, fetchUserSettings } = useUserSettingsStore();
  const { setTag, startSession, isSessionActive, tag } = useSessionStore();
  const popoverRef = useRef<HTMLDivElement>(null); // Ref for the popover content
  const { user } = useAuthStore();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const loadTags = async () => {
      if (user) {
        await fetchUserSettings(user.id);
      }
    };

    if (isTagsPopoverOpen) {
      loadTags();
    }
  }, [isTagsPopoverOpen, fetchUserSettings, user]);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
  }, []);

  const handleTagClick = () => {
    setIsTagsPopoverOpen((prev) => !prev);
  };

  const handleTagValueClick = async (newTag: string) => {
    setTag(newTag);
    setIsTagsPopoverOpen(false);
    if (!isSessionActive) {
      await startSession(newTag);
    }
  };

  const tagEmojis = {
    'Working': '💼',
    'Studying': '📚',
    'Reading': '📖',
    'Meeting': '🤝',
    'Research': '🔬',
    'Meditation': '🧘',
    'Writing': '✍️',
    'Coding': '💻',
    'Designing': '🎨',
    'Editing': '✏️',
  };


  type Tag = keyof typeof tagEmojis; 

  const getEmoji = () => {
    return tag ? tagEmojis[tag as Tag] : '⚪'; 
  };

  // Close the popover if the cursor moves away from the popover or the button
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isTouchDevice && e.relatedTarget instanceof Node && popoverRef.current && !popoverRef.current.contains(e.relatedTarget)) {
      setIsTagsPopoverOpen(false);
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsTagsPopoverOpen(true);
    }
  };

  return (
    <div className="relative">
      <button
        className="p-3 pl-2 pr-4"
        onClick={handleTagClick}
        onMouseEnter={handleMouseEnter} // Open on hover
        onMouseLeave={handleMouseLeave} // Close when the mouse leaves
      >
        <span className='text-gray-600 text-lg rounded-full focus:outline-none hover:bg-gray-100 active:bg-gray-100'>{getEmoji()}</span>
      </button>

      {/* Conditionally render the popover only when it's open */}
      {isTagsPopoverOpen && (
        <div
          ref={popoverRef}
          onMouseLeave={handleMouseLeave} // Handle when mouse leaves the popover content
        >
          <NewSessionTagPopover
            isOpen={isTagsPopoverOpen}
            onClose={() => setIsTagsPopoverOpen(false)}
            availableTags={availableTags}
            onTagClick={handleTagValueClick}
            tagEmojis={tagEmojis}
          />
        </div>
      )}
    </div>
  );
};

export default SessionTag;

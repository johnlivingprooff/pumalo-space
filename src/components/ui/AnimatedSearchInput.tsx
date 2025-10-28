'use client';

import React, { useState, useEffect } from 'react';
import { Input } from './Input';

const placeholders = [
  'Search for properties to buy',
  'Search for properties to rent',
  'Search for properties to lodge',
];

export const AnimatedSearchInput: React.FC = () => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentText = placeholders[currentPlaceholder];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
          setTypingSpeed(20);
        } else {
          // Pause before deleting
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
          setTypingSpeed(50);
        } else {
          // Move to next placeholder
          setIsDeleting(false);
          setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
          setTypingSpeed(500);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPlaceholder, typingSpeed]);

  return (
    <Input
      placeholder={displayText}
      leftIcon={
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      fullWidth
    />
  );
};

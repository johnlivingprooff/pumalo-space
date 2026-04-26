'use client';

import React, { useState, useEffect } from 'react';
import { Input } from './Input';

const placeholders = [
  'Search for properties to buy',
  'Search for properties to rent',
  'Search for properties to lodge',
];

interface AnimatedSearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const AnimatedSearchInput: React.FC<AnimatedSearchInputProps> = ({
  value,
  onChange,
  onKeyDown,
}) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) return;

    const currentText = placeholders[currentPlaceholder];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
          setTypingSpeed(20);
        } else {
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
          setTypingSpeed(50);
        } else {
          setIsDeleting(false);
          setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
          setTypingSpeed(500);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPlaceholder, typingSpeed, isFocused]);

  return (
    <Input
      placeholder={isFocused ? '' : displayText}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      leftIcon={
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      fullWidth
    />
  );
};

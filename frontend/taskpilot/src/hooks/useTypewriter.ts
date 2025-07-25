// src/hooks/useTypewriter.ts
import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 75) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    if (!text) return;

    let i = 0;
    const intervalId = setInterval(() => {
      // Add characters one by one until the full text is displayed
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId); // Stop when done
      }
    }, speed);

    // Cleanup function to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayedText;
};
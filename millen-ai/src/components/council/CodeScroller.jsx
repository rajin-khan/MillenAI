// /millen-ai/src/components/council/CodeScroller.jsx
// ENHANCED: Now accepts a tintColor prop to match the parent card's theme.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/`~';

const generateRandomLine = (length) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const maskStyle = {
  maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
};


const CodeScroller = ({ isActive, tintColor = '#34D399' }) => { // Default to emerald green
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setLines(Array.from({ length: 20 }, () => generateRandomLine(30)));
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const scrollerTextStyle = {
    color: tintColor,
    opacity: 0.5,
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={maskStyle}
        >
          <motion.div
            animate={{ y: ['0%', '-50%'] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="text-[10px] leading-tight font-mono whitespace-pre"
            style={scrollerTextStyle}
          >
            {lines.join('\n')}
            {lines.join('\n')}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CodeScroller;
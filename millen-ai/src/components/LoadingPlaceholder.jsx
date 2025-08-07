import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingPlaceholder = ({ type = 'default' }) => {
  const agentPhrases = ["Searching online...", "Gathering info...", "Getting results..."];
  const defaultPhrases = ["Thinking...", "Processing...", "Generating..."];
  
  const phrases = type === 'agent' ? agentPhrases : defaultPhrases;
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="flex items-center justify-center p-4 w-full max-w-sm">
      <div className="relative flex items-center justify-center w-32 h-32">
        
        {/* 1. The "Breathing" Core */}
        <motion.div
          className="absolute h-1/2 w-1/2 bg-emerald-500/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* 2. The "Tracer" Ring */}
        <motion.svg
          className="absolute w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: -90 }}
          animate={{ rotate: 270 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="gradientTracer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="50" cy="50" r="45"
            stroke="url(#gradientTracer)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="283" // Circumference of the circle
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: [283, 0, -283] }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 1,
            }}
          />
        </motion.svg>
        
        {/* 3. The "Floating" Text */}
        <AnimatePresence mode="wait">
          <motion.span
            key={phrases[phraseIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative text-xs font-semibold text-zinc-100"
            // A softer, more layered glow using multiple drop shadows
            style={{ filter: 'drop-shadow(0 0 5px rgba(52, 211, 153, 0.9)) drop-shadow(0 0 15px rgba(52, 211, 153, 0.5))' }}
          >
            {phrases[phraseIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoadingPlaceholder;
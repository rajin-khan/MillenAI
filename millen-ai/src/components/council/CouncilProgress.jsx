// /millen-ai/src/components/council/CouncilProgress.jsx

import { motion, AnimatePresence } from 'framer-motion';

const CouncilProgress = ({ progress, phaseMessage }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* 1. Core "Breathing" Glow */}
      <motion.div
        className="absolute w-2/3 h-2/3 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, rgba(20, 184, 166, 0) 70%)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <svg className="absolute w-full h-full" viewBox="0 0 140 140">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 2. Static Dotted Track */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          strokeWidth="3"
          className="stroke-zinc-800"
          fill="none"
          strokeDasharray="1 5"
          strokeLinecap="round"
        />

        {/* 3. Glowing Progress Arc */}
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          strokeWidth="3"
          stroke="url(#progressGradient)"
          fill="none"
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ 
            strokeDasharray: circumference,
            filter: 'url(#glow)',
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      
      {/* 4. Orbiting Comet */}
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: (progress / 100) * 360 - 90 }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="absolute" style={{ top: '2px', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_3px_#fff]" />
        </div>
      </motion.div>

      {/* 5. Central Text */}
      <div className="absolute text-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-semibold text-zinc-300"
          >
            {phaseMessage}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CouncilProgress;
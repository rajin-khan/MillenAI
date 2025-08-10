// millen-ai/src/components/council/ModeSwitcher.jsx
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

const ModeSwitcher = ({ mode, setMode, disabled }) => {
  return (
    <div className={`flex items-center p-1 space-x-1 rounded-full bg-zinc-900/50 border border-zinc-800 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {['chat', 'council'].map((item) => {
        const shouldPulse = item === 'council' && mode !== 'council' && !disabled;

        return (
          <motion.button
            key={item}
            onClick={() => !disabled && setMode(item)}
            className="relative px-3 sm:px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300"
            style={{ WebkitTapHighlightColor: "transparent" }}
            disabled={disabled}
            
            // --- START OF NEW ANIMATION LOGIC ---
            animate={{
              scale: shouldPulse ? [1, 1.03, 1] : 1,
              boxShadow: shouldPulse
                ? [
                    "0 0 0 0px rgba(52, 211, 153, 0)",
                    "0 0 12px 2px rgba(52, 211, 153, 0.4)",
                    "0 0 0 0px rgba(52, 211, 153, 0)"
                  ]
                : "0 0 0 0px rgba(52, 211, 153, 0)",
            }}
            transition={{
              duration: 3, // Slower, more subtle duration
              ease: 'easeInOut',
              repeat: shouldPulse ? Infinity : 0,
              repeatType: 'mirror', // Makes the pulse smoothly go in and out
            }}
            // --- END OF NEW ANIMATION LOGIC ---
          >
            {mode === item && (
              <motion.div
                layoutId="mode-switcher-pill"
                className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className={`relative z-10 capitalize flex items-center gap-1.5 sm:gap-2 transition-colors ${mode === item ? 'text-white' : 'text-zinc-400'}`}>
              {item === 'chat' 
                ? <ChatBubbleLeftRightIcon className="w-4 h-4" /> 
                : <SparklesIcon className={`w-4 h-4 ${mode === 'council' ? 'text-white' : 'text-emerald-400'}`} />
              }
              {item}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ModeSwitcher;
// millen-ai/src/components/council/ModeSwitcher.jsx
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const ModeSwitcher = ({ mode, setMode, disabled }) => {
  return (
    <div className={`flex items-center p-1 space-x-1 rounded-full bg-zinc-900/50 border border-zinc-800 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {['chat', 'council'].map((item) => (
        <button
          key={item}
          onClick={() => !disabled && setMode(item)}
          className="relative px-3 sm:px-4 py-1.5 text-sm font-semibold rounded-full transition-colors"
          style={{ WebkitTapHighlightColor: "transparent" }}
          disabled={disabled}
        >
          {mode === item && (
            <motion.div
              layoutId="mode-switcher-pill"
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}
          <span className={`relative z-10 capitalize flex items-center gap-1.5 sm:gap-2 ${mode === item ? 'text-white' : 'text-zinc-400'}`}>
            {item === 'chat' ? <ChatBubbleLeftRightIcon className="w-4 h-4" /> : <span className="text-base">✨</span>}
            {item}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ModeSwitcher;
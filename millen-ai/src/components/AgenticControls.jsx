// /millen-ai/src/components/AgenticControls.jsx

import { GlobeAltIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const ControlButton = ({ icon, title, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={title}
      className={`relative p-2 rounded-full border transition-all duration-200
                  ${isActive 
                    ? 'border-emerald-500/80 bg-emerald-900/50 text-emerald-400 shadow-[0_0_15px_-3px_rgba(52,211,153,0.4)]' 
                    : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                  }`}
    >
      {icon}
    </motion.button>
  );
};

// --- CHANGE 1: Update props to handle separate modes ---
const AgenticControls = ({ isGptOss, webSearchMode, setWebSearchMode, reasoningMode, setReasoningMode }) => {
  return (
    <div className="flex items-center justify-center gap-2 bg-zinc-900/50 p-1 rounded-full border border-zinc-800">
      <ControlButton
        icon={<GlobeAltIcon className="w-5 h-5" />}
        title="Web Search"
        isActive={webSearchMode}
        onClick={() => setWebSearchMode(prev => !prev)}
      />
      
      {/* --- CHANGE 2: Conditionally render the reasoning button for compatible models --- */}
      {isGptOss && (
        <ControlButton
          icon={<CpuChipIcon className="w-5 h-5" />}
          title="Deep Reasoning"
          isActive={reasoningMode}
          onClick={() => setReasoningMode(prev => !prev)}
        />
      )}
    </div>
  );
};

export default AgenticControls;
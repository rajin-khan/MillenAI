import { GlobeAltIcon, CodeBracketSquareIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const ControlButton = ({ icon, title, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={title} // Tooltip for accessibility
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

// This component now represents the available modes for GPT-OSS models.
const AgenticControls = ({ agenticMode, setAgenticMode }) => {
  
  // Toggles are now mutually exclusive. Activating one deactivates the other.
  const handleModeToggle = (mode) => {
    setAgenticMode(prev => prev === mode ? null : mode);
  };

  return (
    <div className="flex items-center justify-center gap-2 bg-zinc-900/50 p-1 rounded-full border border-zinc-800">
      <ControlButton
        icon={<GlobeAltIcon className="w-5 h-5" />}
        title="Agent Mode (Web Search & Code)"
        isActive={agenticMode === 'compound'}
        onClick={() => handleModeToggle('compound')}
      />
      <ControlButton
        icon={<CpuChipIcon className="w-5 h-5" />}
        title="Deep Reasoning"
        isActive={agenticMode === 'reasoning'}
        onClick={() => handleModeToggle('reasoning')}
      />
    </div>
  );
};

export default AgenticControls;
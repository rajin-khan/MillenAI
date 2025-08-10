// /millen-ai/src/components/council/CouncilSynthesis.jsx

import { motion } from 'framer-motion';
import { 
  EyeIcon, EyeSlashIcon, ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const CouncilSynthesis = ({ synthesis, onToggleIndividual, showIndividual, onExport, individualAnalyses }) => {
  // Extract the original prompt as the title
  const titleMatch = synthesis.match(/\*\*Regarding\*\*:\s*(.+?)(?=\n|$)/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Analysis';
  
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} 
      initial="hidden" 
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 truncate" title={title}>
          Council Verdict: {title}
        </h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          {individualAnalyses.length > 0 && (
             <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={onToggleIndividual} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors">
              {showIndividual ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              {showIndividual ? 'Hide Details' : 'Show Details'}
            </motion.button>
          )}
          <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={onExport} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CouncilSynthesis;
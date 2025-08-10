// /src/components/council/CouncilProgress.jsx
import { motion } from 'framer-motion';

const CouncilProgress = ({ progress }) => {
  return (
    <div className="w-full max-w-2xl bg-zinc-800/50 rounded-full h-2 overflow-hidden border border-zinc-700 relative shadow-inner">
      <motion.div
        className="relative h-full rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400" />
        
        {/* Shimmer Effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 left-0 h-full w-1/4 bg-white/30"
              style={{
                filter: 'blur(4px)',
                transform: 'skewX(-20deg)',
              }}
              animate={{ x: ['-25%', '500%'] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
        </div>
      </motion.div>
    </div>
  );
};

export default CouncilProgress;
// /src/components/council/CouncilProgress.jsx
import { motion } from 'framer-motion';

const CouncilProgress = ({ progress }) => {
  return (
    <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden border border-zinc-700">
      <motion.div
        className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // A nice easing curve
      />
    </div>
  );
};

export default CouncilProgress;
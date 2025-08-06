import { motion } from 'framer-motion';

const ContextStatus = ({ currentTokens, maxTokens, modelName }) => {
  const percentage = maxTokens > 0 ? (currentTokens / maxTokens) * 100 : 0;
  
  // Choose color based on usage percentage
  const getBarColor = () => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-yellow-500';
    return 'bg-gradient-to-r from-emerald-500 to-cyan-500';
  };

  return (
    <div className="w-full max-w-xs text-xs text-zinc-400">
      <div className="flex justify-between mb-1">
        <span className="font-medium text-zinc-300">Context: {modelName}</span>
        <span>
          {currentTokens.toLocaleString()} / {maxTokens.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-2 rounded-full ${getBarColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ContextStatus;
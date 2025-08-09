// /millen-ai/src/components/CopyButton.jsx

import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

const CopyButton = ({ onClick, isCopied, IconComponent, onMouseEnter, onMouseLeave }) => {
  const iconVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -45 },
    visible: { scale: 1, opacity: 1, rotate: 0 },
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`relative flex items-center justify-center w-7 h-7 rounded-full bg-zinc-800/50 backdrop-blur-sm 
                 border border-zinc-700 text-zinc-400
                 shadow-[0_0_6px_rgba(161,161,170,0.1)]
                 transition-all duration-200
                 hover:bg-zinc-700/80 hover:text-zinc-200 hover:shadow-[0_0_10px_rgba(161,161,170,0.25)]`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.div
            key="check"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 flex items-center justify-center"
          >
            <CheckIcon className="w-4 h-4 text-emerald-400" />
          </motion.div>
        ) : (
          <motion.div
            key="icon"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 flex items-center justify-center"
          >
            <IconComponent className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyButton;
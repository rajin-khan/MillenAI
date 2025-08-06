import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/solid';

const ModelSelector = ({ selectedModel, onModelChange, models }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (model) => {
    onModelChange(model.name);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full max-w-[240px] sm:max-w-[288px]">
      <div 
        className="p-0.5 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 
                   bg-[length:200%_auto] animate-gradient-flow transition-all duration-300"
      >
        <div className="bg-zinc-900 rounded-[11px]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full px-3 sm:px-4 py-2.5 text-sm font-medium text-zinc-100 transition-all duration-200 bg-transparent rounded-xl hover:bg-white/5 focus:outline-none"
          >
            <span className="truncate">{selectedModel}</span>
            <ChevronDownIcon className={`w-5 h-5 ml-2 -mr-1 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            // NEW: Added classes to ensure it renders correctly on mobile
            className="absolute z-20 w-full mt-2 origin-top bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl"
          >
            <div className="p-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-zinc-200 hover:bg-zinc-800"
                >
                  <span className="flex-grow font-medium truncate">{model.name}</span>
                  {selectedModel === model.name && <CheckIcon className="w-5 h-5 text-emerald-400" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelSelector;
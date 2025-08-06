import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/solid';

const ModelSelector = ({ selectedModel, onModelChange, models }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (model) => {
    onModelChange(model);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-zinc-800 border border-zinc-700 rounded-full hover:bg-zinc-700"
      >
        {selectedModel}
        <ChevronDownIcon className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute z-10 w-56 mt-2 origin-top-right bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl"
          >
            <div className="p-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model.name)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-zinc-800"
                >
                  <span className="flex-grow font-medium text-zinc-200">{model.name}</span>
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
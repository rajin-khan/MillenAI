import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ContextStatus = ({ isModal, isOpen, onClose, currentTokens, maxTokens, modelName }) => {
  const percentage = maxTokens > 0 ? (currentTokens / maxTokens) * 100 : 0;
  
  const getBarColor = () => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-yellow-500';
    return 'bg-gradient-to-r from-emerald-500 to-cyan-500';
  };

  const content = (
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

  if (!isModal) {
    return content;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-[#1C1C1C] border border-zinc-700 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white flex justify-between items-center mb-4">
                  Context Usage
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-700 transition-colors">
                    <XMarkIcon className="w-6 h-6 text-zinc-400"/>
                  </button>
                </Dialog.Title>
                {content}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ContextStatus;
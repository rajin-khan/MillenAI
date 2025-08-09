// /millen-ai/src/components/BetaModal.jsx

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BeakerIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const BetaModal = ({ isOpen, onClose }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Using a solid background, no blur, for performance */}
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Static Gradient Border - No custom animation needed */}
              <div className="p-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[15px] bg-zinc-900 p-8 text-left align-middle shadow-2xl transition-all">
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-zinc-700">
                      <BeakerIcon className="h-8 w-8 text-cyan-400" />
                    </div>

                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-white">
                      Welcome to the Beta!
                    </Dialog.Title>

                    <Dialog.Description className="mt-4 space-y-3 text-sm text-zinc-400">
                      <p>
                        Thank you for being an early user of MillenAI. This application is in <strong>active development</strong>, and is is <strong>not</strong> yet optimized for mobile..
                      </p>
                      <p>
                        You might encounter some bugs or performance hiccups along the way. Your feedback is crucial for making MillenAI better.
                      </p>
                    </Dialog.Description>
                  </div>

                  <div className="mt-8 space-y-3">
                     <a 
                        href="https://github.com/rajin-khan/MillenAI" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group flex w-full items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 bg-zinc-800 text-zinc-200 rounded-lg border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 transition-all"
                      >
                        Report Issues or Contribute on GitHub
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                      <motion.button 
                        type="button" 
                        onClick={onClose} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg shadow-lg shadow-emerald-500/20 transition-transform duration-200"
                      >
                        I Understand
                      </motion.button>
                  </div>

                </Dialog.Panel>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BetaModal;
// /millen-ai/src/components/council/CouncilInfoModal.jsx

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { ScaleIcon } from '@heroicons/react/24/outline';

const CouncilInfoModal = ({ isOpen, onClose }) => {
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-lg" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-zinc-900/50 p-1 text-left align-middle shadow-2xl shadow-cyan-500/10 transition-all border border-zinc-800">
                <div className="rounded-[15px] bg-zinc-900 p-8">
                  <div className="flex flex-col items-center">
                    
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      // --- THE FIX IS HERE ---
                      // Removed the `aspect-video` class to let the container fit the video's natural dimensions.
                      className="w-full max-w-xl bg-black rounded-lg border border-zinc-800 shadow-lg shadow-black/30 overflow-hidden mb-6"
                    >
                       <video
                        className="w-full h-full" // No object-fit class needed, it will fit by default
                        src="/onboarding/councildemo.mp4" 
                        autoPlay loop muted playsInline
                      />
                    </motion.div>
                    
                    <motion.div 
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      className="w-full text-center"
                    >
                      <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-3">
                        <ScaleIcon className="w-7 h-7 text-emerald-400" />
                        <Dialog.Title as="h3" className="text-2xl font-extrabold text-white">
                          The AI Council
                        </Dialog.Title>
                      </motion.div>

                      <motion.p variants={itemVariants} className="mt-3 text-sm text-zinc-300 max-w-xl mx-auto">
                        The AI Council is not just another chatbot. It's an assembly of specialized AI agents working in concert to provide a comprehensive, multi-perspective answer to your most complex questions.
                      </motion.p>
                      
                      <motion.div variants={itemVariants} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                          <h4 className="font-semibold text-emerald-400 text-sm">What kind of questions should I ask?</h4>
                          <ul className="mt-2 list-disc list-inside text-zinc-400 text-xs space-y-1">
                            <li>Complex, open-ended problems requiring research.</li>
                            <li>Strategic planning or brainstorming sessions.</li>
                            <li>Requests for deep analysis with ethical considerations.</li>
                          </ul>
                        </div>
                        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                          <h4 className="font-semibold text-cyan-400 text-sm">What should I expect?</h4>
                           <p className="mt-2 text-zinc-400 text-xs">
                            Expect a more deliberate process. You'll see each agent work in real-time before receiving a final, synthesized verdict.
                          </p>
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="mt-6 max-w-sm mx-auto">
                        <button
                          type="button"
                          onClick={onClose}
                          className="w-full px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg shadow-lg shadow-emerald-500/20 transition-transform duration-200 hover:scale-105 active:scale-100"
                        >
                          Got it, let's begin
                        </button>
                      </motion.div>

                    </motion.div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CouncilInfoModal;
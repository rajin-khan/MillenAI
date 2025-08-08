import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    title: "Sign In to Begin",
    description: "Securely save your chat history and preferences by signing in with your Google account. It's the first step to a personalized AI experience.",
    mediaSrc: "/onboarding/1.mp4"
  },
  {
    title: "Access Your Settings",
    description: "Open the settings panel by clicking the gear icon (⚙️) in the bottom-left corner. This is your command center for customization.",
    mediaSrc: "/onboarding/2.mp4"
  },
  {
    title: "Navigate to Groq Console",
    description: "In the settings, you'll find a link to the Groq Console. This is where you'll generate your high-speed API key.",
    mediaSrc: "/onboarding/3.mp4"
  },
  {
    title: "Create a New API Key",
    description: "In the Groq Console, head to the API Keys section to create a new secret key. Remember to copy it to your clipboard.",
    mediaSrc: "/onboarding/4.mp4"
  },
  {
    title: "Securely Add Your Key",
    description: "Return to MillenAI and paste your API key into the settings. It's stored locally and securely in your browser.",
    mediaSrc: "/onboarding/5.mp4"
  },
  {
    title: "Save and Start Chatting",
    description: "Save your changes, and you're all set! Experience the future of AI conversation at unprecedented speeds.",
    mediaSrc: "/onboarding/6.mp4"
  },
];

const OnboardingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? '50%' : '-50%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? '50%' : '-50%', opacity: 0 }),
  };

  const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const nextStep = () => {
    setDirection(1);
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    if (step > 0) setStep(step - 1);
  };
  
  const currentStep = steps[step];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-lg" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-zinc-900 p-1 text-left align-middle shadow-2xl shadow-cyan-500/10 transition-all">
                <div className="rounded-[15px] bg-gradient-to-br from-zinc-900 to-black p-8">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <motion.div 
                        className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-center"
                        variants={contentContainerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.div variants={itemVariants} className="text-center lg:text-left lg:col-span-5 mb-8 lg:mb-0">
                          <motion.p className="mb-2 text-sm font-semibold text-emerald-400">Step {step + 1} of {steps.length}</motion.p>
                          <motion.h3 className="text-3xl font-extrabold text-white">{currentStep.title}</motion.h3>
                          <motion.p className="mt-4 text-zinc-400">{currentStep.description}</motion.p>
                        </motion.div>
                        
                        <motion.div variants={itemVariants} className="w-full aspect-[2560/1664] bg-black rounded-lg border border-zinc-800 shadow-lg shadow-black/30 overflow-hidden lg:col-span-7">
                          <video
                            key={currentStep.mediaSrc}
                            // --- THE FIX IS HERE ---
                            className="w-full h-full object-contain" // Changed from object-cover
                            // --- END OF FIX ---
                            src={currentStep.mediaSrc}
                            autoPlay loop muted playsInline
                          />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-8 flex items-center justify-between">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prevStep} disabled={step === 0} className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                      <ArrowLeftIcon className="w-5 h-5"/>
                    </motion.button>
                    
                    <div className="flex items-center gap-2">
                      {steps.map((_, i) => (
                        <motion.div 
                          key={i} 
                          className="h-2 rounded-full"
                          animate={{ 
                            width: step === i ? 24 : 8,
                            backgroundColor: step === i ? '#34D399' : '#3F3F46'
                          }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        />
                      ))}
                    </div>
                    
                    {step === steps.length - 1 ? (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg shadow-lg shadow-emerald-500/20 transition-transform duration-200">Get Started</motion.button>
                    ) : (
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={nextStep} className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                        <ArrowRightIcon className="w-5 h-5"/>
                      </motion.button>
                    )}
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

export default OnboardingModal;
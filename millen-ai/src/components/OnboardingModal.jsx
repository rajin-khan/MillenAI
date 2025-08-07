import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    title: "Step 1: Sign In",
    description: "To get started, and save your chat history and preferences, please sign in with your Google account. It's quick, secure, and easy.",
    mediaType: "video",
    mediaSrc: "/onboarding/1.mp4"
  },
  {
    title: "Step 2: Open Settings",
    description: "Once you're signed in, find and click the gear icon (⚙️) in the bottom-left corner to open the settings panel.",
    mediaType: "video",
    mediaSrc: "/onboarding/2.mp4"
  },
  {
    title: "Step 3: Go to Groq Console",
    description: "In the settings panel, you'll find a link to the Groq Console. Click this link to open it in a new tab.",
    mediaType: "video",
    mediaSrc: "/onboarding/3.mp4"
  },
  {
    title: "Step 4: Create Your API Key",
    description: "In the Groq Console, navigate to the API Keys section and create a new secret key. Make sure to copy it to your clipboard.",
    mediaType: "video",
    mediaSrc: "/onboarding/4.mp4"
  },
  {
    title: "Step 5: Paste Your API Key",
    description: "Come back to MillenAI and paste your new API key into the designated field in the settings panel.",
    mediaType: "video",
    mediaSrc: "/onboarding/5.mp4"
  },
  {
    title: "Step 6: Save and Start",
    description: "Click 'Save Changes' to store your key securely in your browser. You're all set to start chatting!",
    mediaType: "video",
    mediaSrc: "/onboarding/6.mp4"
  },
];

const OnboardingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              
              {/* --- FIX 1: Increased modal size --- */}
              {/* Changed max-w-2xl to max-w-4xl and h-[32rem] to h-auto to allow content to define height */}
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-[#161616] border border-zinc-800 p-6 text-left align-middle shadow-2xl shadow-cyan-500/10 transition-all flex flex-col">
                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-white mb-1">
                  Welcome to MillenAI
                </Dialog.Title>
                <p className="text-sm text-zinc-400 mb-4">A quick guide to get you started.</p>
                
                <div className="relative flex-grow flex flex-col overflow-hidden">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="w-full h-full flex flex-col"
                    >
                      {/* --- FIX 2: Applied specific aspect ratio --- */}
                      {/* Changed from flex-grow to a specific aspect ratio to match your videos */}
                      <div className="w-full aspect-[2560/1664] bg-zinc-900/50 rounded-lg border border-zinc-800 my-4 overflow-hidden">
                        {currentStep.mediaType === 'video' ? (
                          <video
                            key={currentStep.mediaSrc}
                            className="w-full h-full object-contain"
                            src={currentStep.mediaSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={currentStep.mediaSrc}
                            alt={currentStep.title}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <div className="flex-shrink-0 text-center">
                         <h4 className="font-semibold text-white">{currentStep.title}</h4>
                         <p className="text-sm text-zinc-400 mt-1 max-w-md mx-auto">{currentStep.description}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex-shrink-0 mt-6 flex items-center justify-between">
                  <button onClick={prevStep} disabled={step === 0} className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                    <ArrowLeftIcon className="w-5 h-5"/>
                  </button>
                  <div className="flex items-center gap-2">
                    {steps.map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-emerald-400' : 'w-2 bg-zinc-600'}`} />
                    ))}
                  </div>
                  {step === steps.length - 1 ? (
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg hover:scale-105 active:scale-100 transition-transform duration-200">Get Started</button>
                  ) : (
                    <button onClick={nextStep} className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                      <ArrowRightIcon className="w-5 h-5"/>
                    </button>
                  )}
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
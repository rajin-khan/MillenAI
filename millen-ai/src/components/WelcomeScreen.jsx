import { SunIcon, BoltIcon, ScaleIcon, PencilSquareIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import ModelSelector from './ModelSelector';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SuggestionCard = ({ icon, title, subtitle, onSuggestionClick }) => {
  const prompt = `${title} ${subtitle}`;
  
  return (
    // The card is now a motion component itself for better hover effects
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.03 }} // Lift and scale on hover
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      onClick={() => onSuggestionClick(prompt)}
      className="group relative p-4 bg-[#1C1C1C] cursor-pointer rounded-2xl border border-zinc-800 overflow-hidden"
    >
      {/* Subtle background glow that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* The main content */}
      <div className="relative">
        <div className="p-2 mb-3 inline-block bg-zinc-800 rounded-lg">
          <div className="w-6 h-6 text-emerald-400">{icon}</div>
        </div>
        <h3 className="mb-1 font-semibold text-white">{title}</h3>
        <p className="text-sm text-zinc-400">{subtitle}</p>
      </div>
    </motion.div>
  );
};

const WelcomeScreen = ({ onSuggestionClick, models, selectedModel, setSelectedModel, onToggleSidebar }) => {
    const listVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    };

    return (
        <div className="flex flex-col w-full h-full text-center">
            {/* Mobile-only header */}
            <div className="flex md:hidden items-center pt-2 pb-4 flex-shrink-0">
                 <button onClick={onToggleSidebar} className="p-2 -ml-2 rounded-full hover:bg-zinc-800">
                    <Bars3Icon className="w-6 h-6 text-white" />
                </button>
            </div>
            
            {/* Main content area that centers vertically */}
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="max-w-2xl w-full">
                    <div className="mb-6 flex justify-center">
                        <ModelSelector 
                            models={models} 
                            selectedModel={selectedModel} 
                            onModelChange={setSelectedModel} 
                        />
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">MillenAI</span>
                    </h1>
                    <p className="mt-2 text-base sm:text-lg text-zinc-400">
                        Click a suggestion below or type to begin.
                    </p>
                    <motion.div 
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
                    >
                        <SuggestionCard onSuggestionClick={onSuggestionClick} icon={<SunIcon />} title="Brainstorm ideas" subtitle="for my new SaaS product" />
                        <SuggestionCard onSuggestionClick={onSuggestionClick} icon={<BoltIcon />} title="Explain a concept" subtitle="like quantum computing" />
                        <SuggestionCard onSuggestionClick={onSuggestionClick} icon={<ScaleIcon />} title="Compare and contrast" subtitle="Python and Javascript" />
                        <SuggestionCard onSuggestionClick={onSuggestionClick} icon={<PencilSquareIcon />} title="Write a blog post" subtitle="about the future of AI" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
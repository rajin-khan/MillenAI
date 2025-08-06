import { SunIcon, BoltIcon, ScaleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SuggestionCard = ({ icon, title, subtitle, onSuggestionClick }) => {
  const prompt = `${title} ${subtitle}`;
  
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={() => onSuggestionClick(prompt)}
      className="p-4 bg-[#1C1C1C] transition-colors duration-300 ease-in-out border cursor-pointer rounded-2xl border-zinc-700 hover:border-emerald-500/80 hover:shadow-lg hover:shadow-emerald-500/10"
    >
      <div className="w-7 h-7 mb-3 text-emerald-400">{icon}</div>
      <h3 className="mb-1 font-semibold text-white">{title}</h3>
      <p className="text-sm text-zinc-400">{subtitle}</p>
    </motion.div>
  );
};

const WelcomeScreen = ({ onSuggestionClick }) => {
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
        <motion.div
            key="welcome"
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full text-center"
        >
            <div className="max-w-2xl">
                <h1 className="text-5xl font-bold tracking-tight text-white">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">MillenAI</span>
                </h1>
                <p className="mt-3 text-lg text-zinc-400">
                    Click a suggestion below or type to begin.
                </p>
                <motion.div 
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-4 mt-12 sm:grid-cols-2"
                >
                    <SuggestionCard onSuggestionClick={onSuggestionClick} icon={<SunIcon />} title="Brainstorm ideas" subtitle="for my new SaaS product" />
                    <SuggestionCard onSuggestionClick={onSuggestionClick} icon={<BoltIcon />} title="Explain a concept" subtitle="like quantum computing" />
                    <SuggestionCard onSuggestionClick={onSuggestionClick} icon={<ScaleIcon />} title="Compare and contrast" subtitle="Python and Javascript" />
                    <SuggestionCard onSuggestionClick={onSuggestionClick} icon={<PencilSquareIcon />} title="Write a blog post" subtitle="about the future of AI" />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default WelcomeScreen;
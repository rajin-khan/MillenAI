// /millen-ai/src/components/WelcomeScreen.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, PencilSquareIcon, AcademicCapIcon, CodeBracketIcon, 
  SparklesIcon, HeartIcon, XMarkIcon, ArrowUpIcon 
} from '@heroicons/react/24/outline';
import ModelSelector from './ModelSelector';
import AgenticControls from './AgenticControls';
import ChatInput from './ChatInput'; // Import ChatInput
import { signInWithGoogle } from '../lib/firebase'; // Import the sign-in function

const suggestionCategories = [
  // ... (keeping the same detailed suggestionCategories data from the previous step)
  { 
    name: 'Write', icon: PencilSquareIcon, 
    prompts: [
      { short: 'Edit my content', long: 'Hi MillenAI, please review the following text for clarity, tone, and grammatical errors. Suggest improvements to make it more concise and impactful for a professional audience.' },
      { short: 'Write in a specific voice', long: 'Write a short story about a lone lighthouse keeper who discovers a mysterious object washed ashore, written in the style of H.P. Lovecraft.' },
      { short: 'Create social media posts', long: 'Generate three engaging Twitter posts and one short LinkedIn article about the ethical implications of advanced AI in creative industries. Include relevant hashtags.' },
      { short: 'Brainstorm creative ideas', long: 'I\'m developing a new SaaS product for remote teams. Brainstorm five unique feature ideas that focus on combating loneliness and fostering a sense of community.' }
    ] 
  },
  { 
    name: 'Learn', icon: AcademicCapIcon, 
    prompts: [
      { short: 'Explain a complex topic', long: 'Explain the concept of quantum entanglement using an analogy that a high school student could easily understand. What are its key implications?' },
      { short: 'Create a knowledge map', long: 'Create a detailed knowledge map or mind map about the major events and figures of the Italian Renaissance, showing how they influenced one another.' },
      { short: 'Find the best resources', long: 'What are the top 5 most influential books on the topic of behavioral economics, and can you provide a one-paragraph summary for each?' },
      { short: 'Create a learning timeline', long: 'I want to learn how to build full-stack applications with React and Node.js. Create a detailed 3-month learning timeline for me, including key topics, project ideas, and resources.' }
    ] 
  },
  { 
    name: 'Code', icon: CodeBracketIcon, 
    prompts: [
      { short: 'Design UI/UX wireframes', long: 'Describe the key UI/UX wireframes for a new mobile fitness app. Detail the user flow from onboarding to starting their first workout.' },
      { short: 'Debug my code', long: 'I have a Python script that\'s supposed to scrape a website but it keeps failing with a timeout error. I\'ll provide the code. Can you help me debug it and suggest improvements for robustness?' },
      { short: 'Design a system', long: 'Design a basic microservice architecture for an e-commerce platform. What services would be essential, and how would they communicate with each other?' },
      { short: 'Review my code', long: 'Please act as a senior software engineer and review the following JavaScript code. Provide feedback on code style, performance, potential bugs, and overall best practices.' }
    ] 
  },
  {
    name: 'Life Stuff', icon: HeartIcon,
    prompts: [
      { short: 'Plan retirement activities', long: 'My parents are newly retired and very active. Can you brainstorm a list of 10 unique and engaging hobbies or long-term projects they could take on together?' },
      { short: 'Help me manage my time', long: 'I\'m struggling with procrastination. Explain the Eisenhower Matrix and help me categorize my current to-do list to improve my time management.' },
      { short: 'Create a reading list', long: 'Create a curated reading list of 7 books that will help me improve my personal growth, covering topics like habits, communication, and mindfulness.' },
      { short: 'Improve communication skills', long: 'What are some practical techniques to become a more empathetic and effective communicator in a professional setting? Provide some example scenarios.' }
    ]
  },
  {
    name: 'Millen\'s Choice', icon: SparklesIcon,
    prompts: [
      { short: 'Discuss future technologies', long: 'Discuss the potential societal impact of fully autonomous, decentralized AI organizations (DAOs). What are the potential benefits and risks?' },
      { short: 'Analyze historical turning points', long: 'Analyze how the invention of the printing press was a major turning point in history, similar to the internet today. What were the key parallels?' },
      { short: 'Discuss social dynamics', long: 'Explore the social dynamics of large online communities, like subreddits or Discord servers. What factors contribute to a healthy, constructive community versus a toxic one?' },
      { short: 'Consider economic theories', long: 'How might Keynesian economic theories apply or need to be adapted in a future where AI handles a significant portion of labor?' }
    ]
  },
];

const WelcomeScreen = ({ user, input, setInput, handleSendMessage, onSuggestionClick, models, selectedModel, setSelectedModel, onToggleSidebar, webSearchMode, setWebSearchMode, reasoningMode, setReasoningMode, settings }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const isGptOss = selectedModel.includes('gpt-oss');

  // --- BUG FIX: Handle prompt clicks intelligently ---
  const handlePromptClick = (promptAction) => {
    if (user) {
      onSuggestionClick(promptAction);
    } else {
      signInWithGoogle(); // Prompt user to sign in first
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.15 } },
  };

  return (
    <div className="flex flex-col w-full h-full text-center">
      <div className="flex md:hidden items-center pt-2 pb-4 flex-shrink-0">
        <button onClick={onToggleSidebar} className="p-2 -ml-2 rounded-full hover:bg-zinc-800">
          <Bars3Icon className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6"
          >
            How can I help you today?
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="mb-8 flex justify-center items-center gap-4"
          >
            <ModelSelector models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
            <AgenticControls isGptOss={isGptOss} webSearchMode={webSearchMode} setWebSearchMode={setWebSearchMode} reasoningMode={reasoningMode} setReasoningMode={setReasoningMode} />
          </motion.div>

          {/* --- NEW: Integrated ChatInput --- */}
          <div className="px-4 sm:px-0">
             <ChatInput 
              input={input} 
              setInput={setInput} 
              handleSendMessage={handleSendMessage} 
              isLoading={false} // Loading is handled by MainContent
              placeholder="Talk to MillenAI, or attach files..." 
              enterToSend={settings.enterToSend} 
            />
          </div>

          <div className="w-full min-h-[160px] sm:min-h-[72px] mt-8">
            <AnimatePresence mode="wait">
              {!activeCategory ? (
                <motion.div
                  key="categories"
                  variants={containerVariants}
                  initial="hidden" animate="visible" exit="exit"
                  className="flex flex-wrap items-center justify-center gap-4"
                >
                  {suggestionCategories.map((cat) => (
                    <motion.button
                      key={cat.name} variants={itemVariants} whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      onClick={() => setActiveCategory(cat)}
                      className="group flex items-center gap-2.5 px-5 py-3 bg-zinc-800/60 text-zinc-200 text-base font-medium rounded-xl border border-zinc-700/60 transition-colors hover:bg-zinc-700/80 hover:border-zinc-600"
                    >
                      <cat.icon className="w-5 h-5 transition-colors group-hover:text-emerald-400" />
                      {cat.name}
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={activeCategory.name} variants={containerVariants}
                  initial="hidden" animate="visible" exit="exit"
                  className="p-1 bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/20 rounded-2xl"
                >
                  <div className="relative bg-[#1C1C1C] rounded-[15px] p-5">
                    <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3 text-lg font-bold text-white">
                        <activeCategory.icon className="w-6 h-6 text-emerald-400" />
                        {activeCategory.name}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#3f3f46' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveCategory(null)}
                        className="p-1.5 rounded-full"
                      >
                        <XMarkIcon className="w-5 h-5 text-zinc-400" />
                      </motion.button>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeCategory.prompts.map((prompt) => (
                        <motion.button
                          key={prompt.short}
                          variants={itemVariants}
                          onClick={() => handlePromptClick(prompt.long)}
                          className="group w-full text-left flex justify-between items-center p-3 text-zinc-300 rounded-lg border border-transparent hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all"
                        >
                          <span className="text-sm">{prompt.short}</span>
                          <ArrowUpIcon className="w-4 h-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
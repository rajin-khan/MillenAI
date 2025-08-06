import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModelSelector from './ModelSelector';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';

const models = [
  { id: 1, name: 'GPT-4 Omni' },
  { id: 2, name: 'Claude 3 Opus' },
  { id: 3, name: 'Google Gemini 1.5' },
];

const MainContent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0].name);
  const [isLoading, setIsLoading] = useState(false);

  const isChatActive = messages.length > 0;

  // This function now handles both typed input and suggestion card clicks
  const handleSendMessage = async (messageContent) => {
    const content = typeof messageContent === 'string' ? messageContent : input;
    if (!content.trim() || isLoading) return;

    const newUserMessage = { role: 'user', content };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = { role: 'assistant', content: `This is a simulated response from ${selectedModel} about "${content}".` };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col flex-1 h-screen relative">
      <div className="absolute top-4 left-6 z-10">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          models={models}
        />
      </div>

      <div className="flex-grow p-6 overflow-y-auto">
        <AnimatePresence>
          {!isChatActive ? (
            <WelcomeScreen key="welcome" onSuggestionClick={handleSendMessage} />
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
              {isLoading && <ChatMessage message={{ role: 'assistant', content: 'Thinking...' }} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        layout
        transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
        className={`flex-shrink-0 px-6 pb-6 w-full
          ${isChatActive
            ? 'relative'
            // THE FIX: Changed bottom-4 to bottom-10 to move it up from the edge
            : 'absolute bottom-10 left-1/2 -translate-x-1/2' 
          }`
        }
      >
        <div className="max-w-3xl mx-auto">
          <ChatInput
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder={`Message ${selectedModel}...`}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default MainContent;
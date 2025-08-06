import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGroqCompletionStream } from '../lib/api';
import { countTokens } from '../lib/tokenizer'; // Import our new token counter
import ModelSelector from './ModelSelector';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';
import ContextStatus from './ContextStatus'; // Import the new progress bar component

// Add the contextWindow property to each model
const models = [
  { id: 1, name: 'llama-3.1-8b-instant', contextWindow: 131072 },
  { id: 2, name: 'llama-3.3-70b-versatile', contextWindow: 32768 },
  { id: 3, name: 'openai/gpt-oss-120b', contextWindow: 131072 },
  { id: 4, name: 'openai/gpt-oss-20b', contextWindow: 131072 },
];

const MainContent = ({ settings }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0].name);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0); // New state for token count
  const chatContainerRef = useRef(null);

  // Find the full model object based on the selected name
  const currentModel = models.find(m => m.name === selectedModel) || models[0];

  // Effect for auto-scrolling
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, tokenCount]); // Also trigger on tokenCount for good measure

  // Effect for dynamically counting tokens
  useEffect(() => {
    const totalTokens = countTokens(messages);
    setTokenCount(totalTokens);
  }, [messages]); // This runs every time the conversation changes

  const isChatActive = messages.length > 0;

  const handleSendMessage = async (messageContent) => {
    const content = typeof messageContent === 'string' ? messageContent : input;
    if (!content.trim() || isLoading) return;
    if (!settings.apiKey) {
      alert("Please set your Groq API key in the settings first.");
      return;
    }

    const newUserMessage = { role: 'user', content };
    const apiRequestMessages = [...messages, newUserMessage].map(({ role, content }) => ({ role, content }));
    
    setMessages(prev => [...prev, newUserMessage, { role: 'assistant', content: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await getGroqCompletionStream(selectedModel, settings.apiKey, apiRequestMessages);
      for await (const chunk of stream) {
        const contentDelta = chunk.choices[0]?.delta?.content || '';
        if (contentDelta) {
          setMessages(prev => {
            const newMessages = prev.slice(0, -1);
            const lastMessage = prev[prev.length - 1];
            const updatedLastMessage = { ...lastMessage, content: lastMessage.content + contentDelta };
            return [...newMessages, updatedLastMessage];
          });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error(`API call for model ${selectedModel} failed:`, error);
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].content = `An error occurred: ${errorMessage}`;
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen relative">
      <div className="absolute top-4 left-6 z-10 flex items-center gap-4">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          models={models}
        />
        {/* Conditionally render the context bar only when a chat is active */}
        {isChatActive && (
          <ContextStatus 
            currentTokens={tokenCount}
            maxTokens={currentModel.contextWindow}
            modelName={currentModel.name}
          />
        )}
      </div>

      <div ref={chatContainerRef} className="flex-grow p-6 pt-20 overflow-y-auto scroll-smooth">
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
              {messages.map((msg, index) => (
                <ChatMessage 
                  key={index} 
                  message={msg}
                  isLoading={isLoading && msg.role === 'assistant' && index === messages.length - 1} 
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        layout
        transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
        className={`flex-shrink-0 px-6 pb-6 w-full
          ${isChatActive ? 'relative' : 'absolute bottom-10 left-1/2 -translate-x-1/2'}`
        }
      >
        <div className="max-w-3xl mx-auto">
          <ChatInput
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder={`Message ${selectedModel}...`}
            enterToSend={settings.enterToSend}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default MainContent;
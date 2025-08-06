import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGroqCompletionStream } from '../lib/api';
import { countTokens } from '../lib/tokenizer';
import ModelSelector from './ModelSelector';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';
import ContextStatus from './ContextStatus';

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
  const [tokenCount, setTokenCount] = useState(0);
  const chatContainerRef = useRef(null);

  const currentModel = models.find(m => m.name === selectedModel) || models[0];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, tokenCount]);

  useEffect(() => {
    const totalTokens = countTokens(messages);
    setTokenCount(totalTokens);
  }, [messages]);

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
      <AnimatePresence>
        {isChatActive ? (
          <motion.header 
            key="chat-header"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-shrink-0 z-10 bg-[#0D1117]/80 backdrop-blur-lg border-b border-white/10"
          >
            <div className="max-w-3xl mx-auto p-4">
              <div className="flex items-center justify-between gap-4">
                <ModelSelector models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
                <ContextStatus currentTokens={tokenCount} maxTokens={currentModel.contextWindow} modelName={currentModel.name} />
              </div>
            </div>
          </motion.header>
        ) : (
          <motion.div 
            key="welcome-selector"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-10"
          >
             <ModelSelector models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto scroll-smooth">
        {isChatActive ? (
          <motion.div key="chat-view" className="max-w-3xl mx-auto pt-8">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} isLoading={isLoading && msg.role === 'assistant' && index === messages.length - 1} />
            ))}
          </motion.div>
        ) : (
          <div key="welcome-view" className="h-full flex items-center justify-center">
            <WelcomeScreen onSuggestionClick={handleSendMessage} />
          </div>
        )}
      </div>
        
      {/* =================== THE FIX IS HERE =================== */}
      <motion.div
        layout
        transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
        className={`w-full ${ // This wrapper is always full-width.
          isChatActive 
            ? 'relative' // In chat, it's in the normal flow.
            : 'absolute bottom-10 left-0 right-0' // Initially, it's a floating container at the bottom.
        }`}
      >
        {/* This inner div uses mx-auto to perfectly center itself in BOTH states. */}
        <div className="max-w-3xl mx-auto px-6 pb-6">
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
      {/* ================= END OF THE FIX ================== */}
    </div>
  );
};

export default MainContent;
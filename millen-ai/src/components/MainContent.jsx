import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getGroqCompletion } from '../lib/groq';
import { getChatMessages, addMessageToChat, createNewChat, updateChatTitle } from '../lib/firestore';
import { countTokens } from '../lib/tokenizer';
import ModelSelector from './ModelSelector';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';
import ContextStatus from './ContextStatus';
import { Bars3Icon } from '@heroicons/react/24/solid';

const MainContent = ({ onToggleSidebar, activeChatId, setActiveChatId, settings, models, selectedModel, setSelectedModel }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const chatContainerRef = useRef(null);

  const currentModel = models.find(m => m.name === selectedModel) || models[0];
  const isChatActive = activeChatId !== null;

  useEffect(() => {
    if (activeChatId) {
      const unsubscribe = getChatMessages(activeChatId, setMessages);
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setTokenCount(countTokens(messages));
  }, [messages]);

  const handleSendMessage = async (messageContent) => {
    if (!user) return;
    const content = typeof messageContent === 'string' ? messageContent : input;
    if (!content.trim() || isLoading) return;
    if (!settings.apiKey) {
      alert("Please set your Groq API key in the settings first.");
      return;
    }

    let currentChatId = activeChatId;
    const isNewChat = !currentChatId;
    
    setInput('');
    setIsLoading(true);

    if (isNewChat) {
      const newChatId = await createNewChat(user.uid);
      setActiveChatId(newChatId);
      currentChatId = newChatId;
      const newTitle = content.split(' ').slice(0, 4).join(' ');
      await updateChatTitle(newChatId, newTitle);
    }

    const userMessage = { role: 'user', content };
    await addMessageToChat(currentChatId, userMessage);

    const apiRequestMessages = [...messages, userMessage].map(({ role, content }) => ({ role, content }));
    
    let payload;
    switch (selectedModel) {
      case 'llama-3.1-8b-instant':
        payload = { model: "llama-3.1-8b-instant", messages: apiRequestMessages };
        break;
      case 'llama-3.3-70b-versatile':
        payload = { model: "llama-3.3-70b-versatile", messages: apiRequestMessages };
        break;
      default:
        const errorMsg = `The model "${selectedModel}" is not handled.`;
        await addMessageToChat(currentChatId, { role: 'assistant', content: errorMsg });
        setIsLoading(false);
        return;
    }

    const placeholderId = `placeholder-${Date.now()}`;
    setMessages(prev => [...prev, { id: placeholderId, role: 'assistant', content: '', isLoading: true }]);

    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const completion = await getGroqCompletion(settings.apiKey, payload);
      const fullResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId ? { ...msg, content: fullResponse, isLoading: false } : msg
      ));
      
      await addMessageToChat(currentChatId, { role: 'assistant', content: fullResponse });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error(`API call failed:`, error);
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId ? { ...msg, content: `An error occurred: ${errorMessage}`, isLoading: false } : msg
      ));
      await addMessageToChat(currentChatId, { role: 'assistant', content: `An error occurred: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen relative">
      <AnimatePresence>
        {isChatActive ? (
          <motion.header key="chat-header" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="flex-shrink-0 z-10 bg-[#0D1117]/80 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-3xl mx-auto p-4">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <button onClick={onToggleSidebar} className="p-2 md:hidden rounded-full hover:bg-zinc-800">
                  <Bars3Icon className="w-6 h-6 text-white" />
                </button>
                <ModelSelector models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
                <ContextStatus currentTokens={tokenCount} maxTokens={currentModel.contextWindow} modelName={currentModel.name} />
              </div>
            </div>
          </motion.header>
        ) : (
          <>
            <motion.div key="welcome-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-4 left-4 z-10 md:hidden">
              <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-zinc-800">
                <Bars3Icon className="w-6 h-6 text-white" />
              </button>
            </motion.div>
            <motion.div key="welcome-selector" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="absolute top-6 left-1/2 -translate-x-1/2 z-10 hidden md:block">
               <ModelSelector models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div ref={chatContainerRef} className="flex-grow p-4 sm:p-6 overflow-y-auto scroll-smooth">
        {isChatActive ? (
          <motion.div key="chat-view" className="max-w-3xl mx-auto pt-8">{messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}</motion.div>
        ) : (
          <div key="welcome-view" className="h-full flex items-center justify-center"><WelcomeScreen onSuggestionClick={handleSendMessage} /></div>
        )}
      </div>
      
      <motion.div layout transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }} className={`w-full max-w-3xl px-4 sm:px-6 pb-6 mx-auto`}>
        <ChatInput
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={`Message ${selectedModel}...`}
          enterToSend={settings.enterToSend}
        />
      </motion.div>
    </div>
  );
};

export default MainContent;
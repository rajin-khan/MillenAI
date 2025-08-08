// /millen-ai/src/components/MainContent.jsx

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
import AgenticControls from './AgenticControls';
import LoadingPlaceholder from './LoadingPlaceholder';
import { Bars3Icon, InformationCircleIcon } from '@heroicons/react/24/solid';

const MainContent = ({ onToggleSidebar, activeChatId, setActiveChatId, settings, models, selectedModel, setSelectedModel, webSearchMode, setWebSearchMode, reasoningMode, setReasoningMode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const chatContainerRef = useRef(null);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);

  const currentModel = models.find(m => m.name === selectedModel) || models[0];
  const isGptOss = selectedModel.includes('gpt-oss');
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
  }, [messages, isLoading]);

  useEffect(() => {
    setTokenCount(countTokens(messages));
  }, [messages]);

  const handleSendMessage = async (messageContent) => {
    const content = typeof messageContent === 'string' ? messageContent : input;
    if (!user || !content.trim() || isLoading) return;
    if (!settings.apiKey) {
      alert("Please set your Groq API key in the settings first.");
      return;
    }

    setIsLoading(true);
    setInput('');

    const userMessage = { role: 'user', content };
    let currentChatId = activeChatId;

    if (!currentChatId) {
      setMessages([userMessage]);
      const newChatId = await createNewChat(user.uid);
      setActiveChatId(newChatId);
      currentChatId = newChatId;
      const newTitle = content.split(' ').slice(0, 4).join(' ');
      await updateChatTitle(newChatId, newTitle);
      await addMessageToChat(currentChatId, userMessage);
    } else {
      await addMessageToChat(currentChatId, userMessage);
    }
    
    // --- CHANGE 1: Exclude 'reasoning' field from history for token optimization ---
    const apiRequestMessages = [...messages, userMessage].map(({ role, content }) => ({ role, content }));
    
    let payload = { model: selectedModel, messages: apiRequestMessages };

    if (webSearchMode) {
      if (isGptOss) {
        payload.tool_choice = "required";
        payload.tools = [{ type: "browser_search" }];
        if (!reasoningMode) {
           payload.reasoning_effort = "low";
        }
      } else {
        payload.model = 'compound-beta';
      }
    }

    if (reasoningMode && isGptOss) {
      payload.reasoning_effort = "high";
    }
    
    try {
      const completion = await getGroqCompletion(settings.apiKey, payload);
      const choice = completion.choices[0]?.message;
      
      // --- CHANGE 2: Create a structured message with separate content and reasoning ---
      const assistantMessage = {
        role: 'assistant',
        content: choice?.content || 'Sorry, I could not generate a response.',
        // Add the reasoning field if it exists in the API response
        ...(choice?.reasoning && { reasoning: choice.reasoning }),
      };
      
      await addMessageToChat(currentChatId, assistantMessage);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error(`API call failed:`, error);
      await addMessageToChat(currentChatId, { role: 'assistant', content: `An error occurred: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full relative">
      <AnimatePresence>
        {isChatActive && (
          <motion.header key="chat-header" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="flex-shrink-0 z-10 bg-[#0D1117]/80 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-4xl mx-auto px-2 sm:px-4">
              <div className="flex items-center justify-between gap-2 h-16">
                <button onClick={onToggleSidebar} className="p-2 -ml-2 md:hidden rounded-full hover:bg-zinc-800"><Bars3Icon className="w-6 h-6 text-white" /></button>
                <div className="flex-1 min-w-0 flex items-center justify-center md:justify-start gap-2 sm:gap-4">
                  <ModelSelector models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
                  <AgenticControls 
                    isGptOss={isGptOss}
                    webSearchMode={webSearchMode}
                    setWebSearchMode={setWebSearchMode}
                    reasoningMode={reasoningMode}
                    setReasoningMode={setReasoningMode}
                  />
                </div>
                <div className="hidden md:block"><ContextStatus isModal={false} currentTokens={tokenCount} maxTokens={currentModel.contextWindow} modelName={currentModel.name} /></div>
                <button onClick={() => setIsContextModalOpen(true)} className="p-2 md:hidden rounded-full hover:bg-zinc-800"><InformationCircleIcon className="w-6 h-6 text-white" /></button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div ref={chatContainerRef} className="flex-grow w-full overflow-y-auto scroll-smooth">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-full">
          { !isChatActive && !isLoading ? (
             <WelcomeScreen 
              onSuggestionClick={handleSendMessage} 
              models={models} 
              selectedModel={selectedModel} 
              setSelectedModel={setSelectedModel} 
              onToggleSidebar={onToggleSidebar} 
              webSearchMode={webSearchMode}
              setWebSearchMode={setWebSearchMode}
              reasoningMode={reasoningMode}
              setReasoningMode={setReasoningMode}
            />
          ) : (
            <motion.div layout="position" className="pt-4 sm:pt-8">
              {messages.map((msg, index) => <ChatMessage key={msg.id || index} message={msg} />)}
              
              {isLoading && (
                <div className="flex justify-center py-6">
                  {/* --- CHANGE 3: Update LoadingPlaceholder type logic --- */}
                  <LoadingPlaceholder type={webSearchMode ? 'agent' : 'default'} />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
      <motion.div layout transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }} className="flex-shrink-0 w-full max-w-3xl px-4 pb-4 sm:px-6 sm:pb-6 mx-auto">
        <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} isLoading={isLoading} placeholder="Talk to MillenAI..." enterToSend={settings.enterToSend} />
      </motion.div>

      <ContextStatus isModal={true} isOpen={isContextModalOpen} onClose={() => setIsContextModalOpen(false)} currentTokens={tokenCount} maxTokens={currentModel.contextWindow} modelName={currentModel.name} />
    </div>
  );
};

export default MainContent;
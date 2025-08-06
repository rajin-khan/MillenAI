import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getGroqCompletionStream } from '../lib/groq';
import { getChatMessages, addMessageToChat, createNewChat, updateChatTitle } from '../lib/firestore';
import { countTokens } from '../lib/tokenizer';
import ModelSelector from './ModelSelector';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';
import ContextStatus from './ContextStatus';

// models are now passed down as props
const MainContent = ({ activeChatId, setActiveChatId, settings, models, selectedModel, setSelectedModel }) => {
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
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
    let fullResponse = '';

    try {
      const stream = await getGroqCompletionStream(selectedModel, settings.apiKey, apiRequestMessages);
      
      const assistantMessageId = Date.now().toString();
      setMessages(prev => [...prev, userMessage, { id: assistantMessageId, role: 'assistant', content: '' }]);

      for await (const chunk of stream) {
        const contentDelta = chunk.choices[0]?.delta?.content || '';
        if (contentDelta) {
          fullResponse += contentDelta;
          // **THE PERFECTED STREAMING LOGIC**
          setMessages(prev => {
            const newMessages = prev.slice(0, -1);
            const lastMessage = prev[prev.length - 1];
            const updatedLastMessage = { ...lastMessage, content: fullResponse };
            return [...newMessages, updatedLastMessage];
          });
        }
      }
      
      await addMessageToChat(currentChatId, { role: 'assistant', content: fullResponse });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error(`API call for model ${selectedModel} failed:`, error);
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
            <div className="max-w-3xl mx-auto p-4"><div className="flex items-center justify-between gap-4"><ModelSelector models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} /><ContextStatus currentTokens={tokenCount} maxTokens={currentModel.contextWindow} modelName={currentModel.name} /></div></div>
          </motion.header>
        ) : (
          <motion.div key="welcome-selector" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
             <ModelSelector models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto scroll-smooth">
        {isChatActive ? (
          <motion.div key="chat-view" className="max-w-3xl mx-auto pt-8">{messages.map((msg, index) => <ChatMessage key={msg.id || index} message={msg} isLoading={isLoading && index === messages.length - 1 && !msg.id} />)}</motion.div>
        ) : (
          <div key="welcome-view" className="h-full flex items-center justify-center"><WelcomeScreen onSuggestionClick={handleSendMessage} /></div>
        )}
      </div>
      
      <motion.div layout transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }} className={`w-full max-w-3xl px-6 pb-6 ${isChatActive ? 'relative mx-auto' : 'absolute bottom-10 left-1/2 -translate-x-1/2'}`}>
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
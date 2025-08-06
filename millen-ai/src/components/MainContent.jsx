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

const models = [
  { id: 1, name: 'llama-3.1-8b-instant', contextWindow: 131072 },
  { id: 2, name: 'llama-3.3-70b-versatile', contextWindow: 32768 },
  { id: 3, name: 'openai/gpt-oss-120b', contextWindow: 131072 },
  { id: 4, name: 'openai/gpt-oss-20b', contextWindow: 131072 },
];

const MainContent = ({ activeChatId, setActiveChatId, settings }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0].name);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const chatContainerRef = useRef(null);

  const currentModel = models.find(m => m.name === selectedModel) || models[0];

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
    let fullResponse = '';

    try {
      const stream = await getGroqCompletionStream(selectedModel, settings.apiKey, apiRequestMessages);
      
      const assistantMessageId = Date.now().toString();
      setMessages(prev => [...prev, userMessage, { id: assistantMessageId, role: 'assistant', content: '' }]);

      for await (const chunk of stream) {
        const contentDelta = chunk.choices[0]?.delta?.content || '';
        if (contentDelta) {
          fullResponse += contentDelta;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg
          ));
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
        {activeChatId ? (
          <motion.header key="chat-header" initial={{ opacity: 0}} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-shrink-0 z-10 bg-[#0D1117]/80 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-3xl mx-auto p-4 flex items-center justify-between gap-4">
              <ModelSelector models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
              <ContextStatus currentTokens={tokenCount} maxTokens={currentModel.contextWindow} modelName={currentModel.name} />
            </div>
          </motion.header>
        ) : null}
      </AnimatePresence>

      <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto scroll-smooth">
        {!activeChatId ? (
          <div className="h-full flex flex-col items-center justify-center">
            <WelcomeScreen onSuggestionClick={handleSendMessage} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg, index) => <ChatMessage key={msg.id || index} message={msg} isLoading={isLoading && index === messages.length - 1 && !msg.id} />)}
          </div>
        )}
      </div>
      
      {!(activeChatId && messages.length === 0 && isLoading) &&
        <div className={`flex-shrink-0 px-6 pb-6 w-full ${!activeChatId ? 'absolute bottom-10 left-0 right-0' : 'relative'}`}>
          <div className="max-w-3xl mx-auto">
            <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} isLoading={isLoading} placeholder={`Message ${selectedModel}...`} />
          </div>
        </div>
      }
    </div>
  );
};

export default MainContent;
import { motion } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const BlinkingCursor = () => (
  <span className="inline-block w-2 h-5 ml-1 bg-white animate-pulse" />
);

const ChatMessage = ({ message, isLoading }) => {
  const { role, content } = message;
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-4 p-4 my-2 rounded-xl ${isUser ? 'bg-zinc-800/50' : ''}`}
    >
      {isUser ? (
        <UserCircleIcon className="w-8 h-8 flex-shrink-0 text-zinc-400" />
      ) : (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600" />
      )}
      <div className="flex flex-col flex-1">
        <span className="font-bold text-white">{isUser ? 'You' : 'MillenAI'}</span>
        <p className="text-zinc-200 whitespace-pre-wrap">
          {content}
          {isAssistant && isLoading && <BlinkingCursor />}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
import { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftIcon, PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/solid';

const ChatHistoryItem = ({ chat, isActive, onClick, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);
  const inputRef = useRef(null);

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleRename = () => {
    if (title.trim() && title !== chat.title) {
      onRename(chat.id, title.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setTitle(chat.title);
      setIsEditing(false);
    }
  };

  return (
    <div 
      onClick={() => !isEditing && onClick()}
      className={`group relative flex items-center gap-3 cursor-pointer rounded-lg p-3 transition-colors duration-200 ${isActive ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'}`}
    >
      <ChatBubbleLeftIcon className="w-5 h-5 flex-shrink-0 text-zinc-400" />
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white text-sm font-medium outline-none ring-1 ring-emerald-500 rounded px-1"
        />
      ) : (
        <p className={`flex-1 truncate text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-300'}`}>
          {chat.title || 'New Chat'}
        </p>
      )}

      {/* Action Icons */}
      <div className="absolute right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {isEditing ? (
          <button onClick={handleRename} className="p-1 hover:text-white text-emerald-400"><CheckIcon className="w-4 h-4" /></button>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="p-1 hover:text-white text-zinc-400"><PencilIcon className="w-4 h-4" /></button>
            <button onClick={() => onDelete(chat.id)} className="p-1 hover:text-red-400 text-zinc-400"><TrashIcon className="w-4 h-4" /></button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryItem;
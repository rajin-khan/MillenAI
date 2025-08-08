// /millen-ai/src/components/ChatInput.jsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, PaperClipIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { docProcessor } from '../lib/documentProcessor';
import FileIcon from './FileIcon';

const ChatInput = ({ input, setInput, handleSendMessage, isLoading, placeholder, enterToSend }) => {
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      attachments.forEach(att => {
        if (att.previewUrl) URL.revokeObjectURL(att.previewUrl);
      });
    };
  }, [attachments]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const newAttachments = files.map(file => {
      const fileType = docProcessor.getFileType(file);
      return {
        id: `${file.name}-${Date.now()}`,
        file,
        status: 'parsing',
        data: null,
        previewUrl: fileType === 'image' ? URL.createObjectURL(file) : null,
      };
    });

    setAttachments(prev => [...prev, ...newAttachments]);

    for (const attachment of newAttachments) {
      try {
        const result = await docProcessor.processFile(attachment.file);
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id ? { ...att, status: 'ready', data: result } : att
        ));
      } catch (error) {
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id ? { ...att, status: 'error', data: { name: attachment.file.name, content: error.message } } : att
        ));
      }
    }
    
    event.target.value = null;
  };

  const removeAttachment = (id) => {
    setAttachments(prev => {
      const attachmentToRemove = prev.find(att => att.id === id);
      if (attachmentToRemove && attachmentToRemove.previewUrl) {
        URL.revokeObjectURL(attachmentToRemove.previewUrl);
      }
      return prev.filter(att => att.id !== id);
    });
  };

  const onSendMessage = () => {
    const readyAttachments = attachments
      .filter(att => att.status === 'ready')
      .map(att => ({ ...att.data, previewUrl: att.previewUrl }));

    if (isLoading || (!input.trim() && readyAttachments.length === 0)) return;

    handleSendMessage(input, readyAttachments);
    setAttachments([]);
  };

  return (
    <div className="w-full max-w-3xl">
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 bg-[#1C1C1C]/80 backdrop-blur-sm border border-zinc-700 rounded-lg space-y-2 overflow-hidden"
          >
            {attachments.map((att) => (
              <div key={att.id} className="flex items-center gap-3 text-sm text-zinc-200">
                {att.previewUrl ? (
                  <img src={att.previewUrl} alt={att.file.name} className="w-8 h-8 object-cover rounded-md border border-zinc-700" />
                ) : (
                  <FileIcon fileType={att.data?.type || docProcessor.getFileType(att.file)} />
                )}
                <span className="flex-grow truncate">{att.file.name}</span>
                {att.status === 'parsing' && <ArrowPathIcon className="w-4 h-4 text-zinc-400 animate-spin flex-shrink-0" />}
                {att.status === 'error' && <span className="text-xs text-red-400 truncate flex-shrink-0">{att.data.content}</span>}
                <button onClick={() => removeAttachment(att.id)} className="text-zinc-500 hover:text-white flex-shrink-0">
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 shadow-2xl shadow-black/40">
        <div className="relative flex items-center p-1 bg-[#1C1C1C] rounded-[15px]">
          <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-2.5 ml-2 rounded-full hover:bg-zinc-700 transition-colors"
            title="Attach files"
          >
            <PaperClipIcon className="w-5 h-5 text-zinc-400" />
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (enterToSend && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            className="w-full h-12 max-h-48 pl-3 pr-20 py-3 text-base bg-transparent appearance-none text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 resize-none"
            placeholder={placeholder}
            rows="1"
          />
          <button
            onClick={onSendMessage}
            disabled={isLoading || (!input.trim() && attachments.filter(a => a.status === 'ready').length === 0)}
            className="absolute right-2.5 bottom-2.5 p-2.5 transition-all duration-300 ease-in-out rounded-full bg-emerald-600 hover:bg-emerald-500 hover:scale-110 active:scale-100 disabled:bg-zinc-700 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
// /millen-ai/src/components/ChatInput.jsx

import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const ChatInput = ({ input, setInput, handleSendMessage, isLoading, placeholder, enterToSend }) => {
  return (
    // --- CHANGE: Added shadow and refined gradient/animation logic ---
    <div className={`w-full max-w-3xl p-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 shadow-2xl shadow-black/40 transition-all duration-500`}>
      <div className="relative flex items-center p-1 bg-[#1C1C1C] rounded-[15px]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (enterToSend && e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="w-full h-12 max-h-48 pl-5 pr-20 py-3 text-base bg-transparent appearance-none text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 resize-none"
          placeholder={placeholder}
          rows="1"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !input.trim()}
          className="absolute right-2.5 bottom-2.5 p-2.5 transition-all duration-300 ease-in-out rounded-full bg-emerald-600 hover:bg-emerald-500 hover:scale-110 active:scale-100 disabled:bg-zinc-700 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
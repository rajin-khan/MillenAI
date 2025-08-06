import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const ChatInput = ({ input, setInput, handleSendMessage, isLoading, placeholder, enterToSend }) => {
  return (
    <div className="w-full max-w-3xl p-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500">
      <div className="relative flex items-center p-1 bg-[#1C1C1C] rounded-full">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (enterToSend && e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="w-full h-12 max-h-48 pl-5 pr-20 py-3 text-base bg-transparent appearance-none rounded-full text-zinc-100 focus:outline-none focus:ring-0 resize-none"
          placeholder={placeholder}
          rows="1"
        />
        <button
          onClick={() => handleSendMessage()} // THE FIX: Ensures no event object is passed.
          disabled={isLoading || !input.trim()}
          className="absolute right-2.5 bottom-2.5 p-2.5 transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 hover:scale-110 active:scale-100 disabled:bg-zinc-700 disabled:from-zinc-700 disabled:hover:scale-100"
        >
          <PaperAirplaneIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
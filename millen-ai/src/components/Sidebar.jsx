import { 
  PlusIcon, 
  Cog6ToothIcon, 
  ChatBubbleLeftIcon, 
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

// A reusable component for chat history items to keep the code clean
const ChatHistoryItem = ({ children, active }) => (
  <div 
    className={`
      group relative flex items-center gap-3 cursor-pointer rounded-lg p-3
      transition-all duration-200 ease-in-out
      ${active ? 'bg-zinc-800' : 'hover:bg-zinc-800/50 hover:-translate-y-px'}
    `}
  >
    <ChatBubbleLeftIcon className="w-5 h-5 flex-shrink-0 text-zinc-400" />
    <p className={`flex-1 truncate text-sm font-medium ${active ? 'text-white' : 'text-zinc-300'}`}>
      {children}
    </p>
    {/* Icons appear on hover for inactive items */}
    {!active && (
      <div className="absolute right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PencilSquareIcon className="w-5 h-5 text-zinc-400 hover:text-white transition-colors"/>
        <TrashIcon className="w-5 h-5 text-zinc-400 hover:text-red-500 transition-colors"/>
      </div>
    )}
  </div>
);

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 p-3 bg-black/20 border-r border-white/5">
      {/* Header with Hover Effect */}
      <div className="flex-shrink-0 mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-wider text-transparent transition-all duration-300 ease-in-out bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] cursor-default">
          MillenAI
        </h1>
      </div>

      {/* New Chat Button */}
      <button className="flex items-center justify-center w-full gap-2 px-4 py-2.5 mb-5 text-base font-semibold text-white transition-all duration-300 ease-in-out rounded-full shadow-lg bg-gradient-to-r from-emerald-500/90 to-cyan-600/90 hover:from-emerald-500 hover:to-cyan-600 hover:scale-105 hover:shadow-cyan-500/20 active:scale-100">
        <PlusIcon className="w-5 h-5" />
        New Chat
      </button>
      
      {/* Chat History */}
      <div className="flex-grow pr-1 -mr-2 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <ChatHistoryItem active={true}>The future of frontend design</ChatHistoryItem>
          <ChatHistoryItem>How to make a great API</ChatHistoryItem>
          <ChatHistoryItem>React state management patterns</ChatHistoryItem>
          <ChatHistoryItem>Advanced Tailwind CSS tricks</ChatHistoryItem>
        </div>
      </div>

      {/* User Profile / Settings */}
      <div className="flex-shrink-0 pt-3 mt-2 border-t border-white/10">
        <div className="flex items-center w-full gap-2.5 p-2 text-left transition-colors duration-200 rounded-lg cursor-pointer hover:bg-zinc-800 text-zinc-200">
          <UserCircleIcon className="w-9 h-9 text-zinc-400 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-sm truncate">Your Name</p>
            <p className="text-xs text-zinc-400">View settings</p>
          </div>
          <Cog6ToothIcon className="w-5 h-5 ml-auto text-zinc-400 transition-transform duration-500 ease-in-out hover:rotate-90" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
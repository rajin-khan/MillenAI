import { 
  PlusIcon, 
  Cog6ToothIcon, 
  ChatBubbleLeftIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const ChatHistoryItem = ({ children, active }) => (
  <div 
    className={`
      flex items-center gap-3 cursor-pointer rounded-lg p-3
      transition-colors duration-200
      ${active ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'}
    `}
  >
    <ChatBubbleLeftIcon className="w-5 h-5 flex-shrink-0 text-zinc-400" />
    <p className={`flex-1 truncate text-sm font-medium ${active ? 'text-white' : 'text-zinc-300'}`}>
      {children}
    </p>
  </div>
);

const Sidebar = ({ onOpenSettings }) => {
  return (
    <div className="flex flex-col w-72 p-3 bg-[#111111] border-r border-white/5">
      <div className="flex-shrink-0 mb-5 text-left pl-2">
        <h1 className="text-2xl font-bold tracking-wider text-transparent transition-all duration-300 ease-in-out bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 cursor-default">
          MillenAI
        </h1>
      </div>

      <button className="flex items-center justify-center w-full gap-2 px-4 py-2.5 mb-6 text-base font-semibold text-white transition-all duration-300 ease-in-out rounded-full shadow-lg bg-gradient-to-r from-emerald-400 to-cyan-400 hover:scale-105 hover:shadow-cyan-500/20 active:scale-100">
        <PlusIcon className="w-5 h-5" />
        New Chat
      </button>
      
      <div className="flex-grow pr-1 -mr-2 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <ChatHistoryItem active={true}>The future of frontend de...</ChatHistoryItem>
          <ChatHistoryItem>How to make a great API</ChatHistoryItem>
          <ChatHistoryItem>React state management...</ChatHistoryItem>
          <ChatHistoryItem>Advanced Tailwind CSS t...</ChatHistoryItem>
        </div>
      </div>

      <div className="flex-shrink-0 pt-3 mt-2 border-t border-white/10">
        <div 
          onClick={onOpenSettings} 
          className="group flex items-center w-full gap-3 p-2 text-left transition-colors duration-200 rounded-lg cursor-pointer hover:bg-zinc-800 text-zinc-200"
        >
          <UserCircleIcon className="w-9 h-9 text-zinc-400 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-sm truncate">Your Name</p>
            <p className="text-xs text-zinc-400">View settings</p>
          </div>
          <Cog6ToothIcon className="w-5 h-5 ml-auto text-zinc-400 transition-transform duration-500 ease-in-out group-hover:rotate-90" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
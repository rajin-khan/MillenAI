import { useEffect, useState } from 'react';
import { PlusIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, logOut } from '../lib/firebase';
import { getUserChats } from '../lib/firestore';

const Sidebar = ({ activeChatId, setActiveChatId, onOpenSettings }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);

  // THIS IS THE DEFINITIVE FIX FOR THE SIDEBAR
  useEffect(() => {
    let unsubscribe;
    // Only attempt to fetch chats if we have a logged-in user.
    if (user) {
      // getUserChats returns an unsubscribe function from Firestore's onSnapshot.
      // This sets up the real-time listener.
      unsubscribe = getUserChats(user.uid, (fetchedChats) => {
        setChats(fetchedChats); // The callback updates our state whenever data changes.
      });
    } else {
      // If there's no user, ensure the chat list is empty.
      setChats([]);
    }

    // This is the cleanup function. It runs when the component unmounts
    // or when the `user` dependency changes (e.g., on logout).
    return () => {
      if (unsubscribe) {
        unsubscribe(); // This detaches the real-time listener to prevent memory leaks.
      }
    };
  }, [user]); // The effect is perfectly dependent on the user's auth state.

  const handleNewChat = () => {
    setActiveChatId(null);
  };
  
  const UserAvatar = ({ user }) => {
    if (user.photoURL) {
      return <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-full" />;
    }
    const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : '?';
    return (
      <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">
        {initial}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-72 p-3 bg-[#111111] border-r border-white/5">
      <div className="flex-shrink-0 mb-5 text-left pl-2">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">MillenAI</h1>
      </div>

      <button onClick={handleNewChat} className="flex items-center justify-center w-full gap-2 px-4 py-2.5 mb-6 text-base font-semibold text-white transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:scale-105 active:scale-100 disabled:opacity-50" disabled={!user}>
        <PlusIcon className="w-5 h-5" />
        New Chat
      </button>
      
      <div className="flex-grow pr-1 -mr-2 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex items-center gap-3 cursor-pointer rounded-lg p-3 transition-colors duration-200 ${activeChatId === chat.id ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'}`}
            >
              <ChatBubbleLeftIcon className="w-5 h-5 flex-shrink-0 text-zinc-400" />
              <p className={`flex-1 truncate text-sm font-medium ${activeChatId === chat.id ? 'text-white' : 'text-zinc-300'}`}>
                {chat.title || 'New Chat'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 pt-3 mt-2 border-t border-white/10">
        {user ? (
          <div className="group flex items-center w-full gap-3 p-2 text-zinc-200">
            <UserAvatar user={user} />
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm truncate">{user.displayName}</p>
              <p className="text-xs text-zinc-400 truncate">{user.email}</p>
            </div>
            <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-zinc-700 transition-colors" title="Settings">
              <Cog6ToothIcon className="w-6 h-6 text-zinc-400" />
            </button>
            <button onClick={logOut} className="p-2 rounded-full hover:bg-zinc-700 transition-colors" title="Sign Out">
              <ArrowRightOnRectangleIcon className="w-6 h-6 text-zinc-400" />
            </button>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className="w-full p-3 font-semibold text-center text-white bg-emerald-600 rounded-lg hover:bg-emerald-500">
            Sign In with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
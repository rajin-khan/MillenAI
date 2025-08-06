import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, logOut } from '../lib/firebase';
import { getUserChats, updateChatTitle, deleteChat } from '../lib/firestore';
import ChatHistoryItem from './ChatHistoryItem';
import ConfirmationModal from './ConfirmationModal';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onClose, activeChatId, setActiveChatId, onOpenSettings }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      unsubscribe = getUserChats(user.uid, setChats);
    } else {
      setChats([]);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const handleNewChat = () => {
    setActiveChatId(null);
    onClose(); // Close sidebar on mobile after clicking "New Chat"
  };
  
  const openDeleteModal = (chatId) => {
    setChatToDelete(chatId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (chatToDelete) {
      await deleteChat(chatToDelete);
      if (chatToDelete === activeChatId) {
        setActiveChatId(null);
      }
      setChatToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleRenameChat = async (chatId, newTitle) => {
    await updateChatTitle(chatId, newTitle);
  };
  
  const UserAvatar = ({ user }) => {
    if (user.photoURL) return <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-full" />;
    const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : '?';
    return <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">{initial}</div>;
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const sidebarContent = (
    <div className="flex flex-col w-72 p-3 bg-[#111111] border-r border-white/5 h-full">
      <div className="flex-shrink-0 mb-5 text-left pl-2">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">MillenAI</h1>
      </div>

      <button onClick={handleNewChat} className="flex items-center justify-center w-full gap-2 px-4 py-2.5 mb-6 text-base font-semibold text-white transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:scale-105 active:scale-100 disabled:opacity-50" disabled={!user}>
        <PlusIcon className="w-5 h-5" />
        New Chat
      </button>
      
      <div className="flex-grow pr-1 -mr-2 overflow-y-auto">
        <motion.div className="flex flex-col gap-1" variants={listVariants} initial="hidden" animate="visible">
          {chats.map(chat => (
            <motion.div key={chat.id} variants={itemVariants}>
              <ChatHistoryItem
                chat={chat}
                isActive={activeChatId === chat.id}
                onClick={() => { setActiveChatId(chat.id); onClose(); }} // Close sidebar on chat selection
                onRename={handleRenameChat}
                onDelete={openDeleteModal}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex-shrink-0 pt-3 mt-2 border-t border-white/10">
        {user ? (
          <div className="group flex items-center w-full gap-3 p-2 text-zinc-200">
            <UserAvatar user={user} />
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm truncate">{user.displayName}</p>
              <p className="text-xs text-zinc-400 truncate">{user.email}</p>
            </div>
            <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-zinc-700 transition-colors" title="Settings"><Cog6ToothIcon className="w-6 h-6 text-zinc-400" /></button>
            <button onClick={logOut} className="p-2 rounded-full hover:bg-zinc-700 transition-colors" title="Sign Out"><ArrowRightOnRectangleIcon className="w-6 h-6 text-zinc-400" /></button>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className="w-full p-3 font-semibold text-center text-white bg-emerald-600 rounded-lg hover:bg-emerald-500">Sign In with Google</button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={onClose}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1">
                {sidebarContent}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* --- DESKTOP SIDEBAR (STATIC) --- */}
      <div className="hidden md:flex md:flex-shrink-0">
        {sidebarContent}
      </div>
      
      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title="Delete Chat" message="Are you sure you want to permanently delete this chat? This action cannot be undone." />
    </>
  );
};

export default Sidebar;
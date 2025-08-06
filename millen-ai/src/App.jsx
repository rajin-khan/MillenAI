import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsModal from './components/SettingsModal';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { user, loading } = useAuth();
  const [activeChatId, setActiveChatId] = useState(null);
  
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('millenai_settings');
    return savedSettings ? JSON.parse(savedSettings) : { apiKey: '', enterToSend: true, darkMode: true };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('millenai_settings', JSON.stringify(settings));
  }, [settings]);

  // If the user logs out, reset the active chat to show the welcome screen
  useEffect(() => {
    if (!user) {
      setActiveChatId(null);
    }
  }, [user]);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  // While the auth state is being determined, show a full-screen loader
  if (loading) {
    return (
      <div className="bg-[#0D1117] h-screen w-full flex items-center justify-center text-white font-bold text-2xl animate-pulse">
        MillenAI
      </div>
    );
  }

  return (
    <main className="flex w-full h-screen font-sans bg-[#0D1117]">
      <Sidebar 
        activeChatId={activeChatId} 
        setActiveChatId={setActiveChatId}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <MainContent 
        key={activeChatId || 'welcome-screen'} // CRITICAL: This forces a re-render on new chat
        activeChatId={activeChatId} 
        setActiveChatId={setActiveChatId} 
        settings={settings}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        initialSettings={settings}
      />
    </main>
  );
};

export default App;
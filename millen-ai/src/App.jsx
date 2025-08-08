// /millen-ai/src/App.jsx

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal';
import { useAuth } from './context/AuthContext';

const models = [
  { id: 3, name: 'openai/gpt-oss-120b', contextWindow: 131072 },
  { id: 4, name: 'openai/gpt-oss-20b', contextWindow: 131072 },
  { id: 1, name: 'llama-3.1-8b-instant', contextWindow: 131072 },
  { id: 2, name: 'llama-3.3-70b-versatile', contextWindow: 32768 },
];

const App = () => {
  const { user, loading } = useAuth();
  const [activeChatId, setActiveChatId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(models[0].name);
  
  // --- CHANGE 1: Replace agenticMode with two separate states ---
  const [webSearchMode, setWebSearchMode] = useState(false);
  const [reasoningMode, setReasoningMode] = useState(false);
  
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('millenai_settings');
    return savedSettings ? JSON.parse(savedSettings) : { apiKey: '', enterToSend: true, darkMode: true };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('millenai_has_visited');
    if (!hasVisited) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('millenai_has_visited', 'true');
    setIsOnboardingOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('millenai_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!user) setActiveChatId(null);
  }, [user]);

  // --- CHANGE 2: Reset new modes when model changes ---
  useEffect(() => {
    setWebSearchMode(false);
    setReasoningMode(false);
  }, [selectedModel, activeChatId]);


  const handleSaveSettings = (newSettings) => setSettings(newSettings);

  if (loading) {
    return <div className="bg-[#0D1117] h-screen w-full flex items-center justify-center text-white font-bold text-2xl animate-pulse">MillenAI</div>;
  }

  return (
    <main className="relative flex w-full h-dvh font-sans bg-[#0D1117] overflow-hidden">
      <div 
        className="absolute inset-0 -z-10 bg-aurora bg-[length:200%_200%] animate-aurora-background" 
      />
      
      <OnboardingModal isOpen={isOnboardingOpen} onClose={handleOnboardingComplete} />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeChatId={activeChatId} 
        setActiveChatId={setActiveChatId}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <MainContent 
        onToggleSidebar={() => setIsSidebarOpen(true)}
        activeChatId={activeChatId} 
        setActiveChatId={setActiveChatId} 
        settings={settings}
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        // --- CHANGE 3: Pass down new state and setters ---
        webSearchMode={webSearchMode}
        setWebSearchMode={setWebSearchMode}
        reasoningMode={reasoningMode}
        setReasoningMode={setReasoningMode}
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
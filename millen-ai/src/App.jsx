// /millen-ai/src/App.jsx

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal';
import AnimatedBackground from './components/AnimatedBackground';
import { useAuth } from './context/AuthContext';
import { usePrevious } from './hooks/usePrevious';
import BetaModal from './components/BetaModal'; // --- CHANGE: Import the new modal ---

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
  const [webSearchMode, setWebSearchMode] = useState(false);
  const [reasoningMode, setReasoningMode] = useState(false);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('millenai_settings');
    return savedSettings ? JSON.parse(savedSettings) : { apiKey: '', enterToSend: true, darkMode: true };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false); // --- CHANGE: State for Beta modal ---

  const prevActiveChatId = usePrevious(activeChatId);

  useEffect(() => {
    const hasVisited = localStorage.getItem('millenai_has_visited');
    if (!hasVisited) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // --- CHANGE: Onboarding completion now triggers the Beta modal ---
  const handleOnboardingComplete = () => {
    setIsOnboardingOpen(false);
    setIsBetaModalOpen(true); // Show Beta modal right after
  };

  // --- CHANGE: Closing the Beta modal completes the first-visit flow ---
  const handleBetaModalClose = () => {
    localStorage.setItem('millenai_has_visited', 'true');
    setIsBetaModalOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('millenai_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!user) setActiveChatId(null);
  }, [user]);

  useEffect(() => {
    if (prevActiveChatId !== null) {
      setWebSearchMode(false);
      setReasoningMode(false);
    }
  }, [selectedModel, activeChatId, prevActiveChatId]);

  const handleSaveSettings = (newSettings) => setSettings(newSettings);

  if (loading) {
    return <div className="bg-[#0D1117] h-screen w-full flex items-center justify-center text-white font-bold text-2xl animate-pulse">MillenAI</div>;
  }

  return (
    <main className="relative flex w-full h-dvh font-sans bg-transparent overflow-hidden">
      <AnimatedBackground />
      
      <OnboardingModal isOpen={isOnboardingOpen} onClose={handleOnboardingComplete} />
      {/* --- CHANGE: Render the Beta modal and pass its close handler --- */}
      <BetaModal isOpen={isBetaModalOpen} onClose={handleBetaModalClose} />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeChatId={activeChatId} 
        setActiveChatId={setActiveChatId}
        onOpenSettings={() => setIsSettingsOpen(true)}
        // --- CHANGE: Pass a function to open the Beta modal from the sidebar ---
        onOpenBetaModal={() => setIsBetaModalOpen(true)}
      />
      <MainContent 
        onToggleSidebar={() => setIsSidebarOpen(true)}
        activeChatId={activeChatId} 
        setActiveChatId={setActiveChatId} 
        settings={settings}
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
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
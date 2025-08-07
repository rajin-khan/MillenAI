import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal'; // <-- 1. Import the new modal
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
  const [agenticMode, setAgenticMode] = useState(null);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('millenai_settings');
    return savedSettings ? JSON.parse(savedSettings) : { apiKey: '', enterToSend: true, darkMode: true };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- 2. ADD THIS NEW STATE AND EFFECT ---
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    // Check localStorage only once when the app component mounts
    const hasVisited = localStorage.getItem('millenai_has_visited');
    if (!hasVisited) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('millenai_has_visited', 'true');
    setIsOnboardingOpen(false);
  };
  // --- END OF NEW LOGIC ---

  useEffect(() => {
    localStorage.setItem('millenai_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!user) setActiveChatId(null);
  }, [user]);

  useEffect(() => {
    setAgenticMode(null);
  }, [selectedModel]);

  const handleSaveSettings = (newSettings) => setSettings(newSettings);

  if (loading) {
    return <div className="bg-[#0D1117] h-screen w-full flex items-center justify-center text-white font-bold text-2xl animate-pulse">MillenAI</div>;
  }

  return (
    <main className="relative flex w-full h-dvh font-sans bg-[#0D1117] overflow-hidden">
      <div 
        className="absolute inset-0 -z-10 bg-aurora bg-[length:200%_200%] animate-aurora-background" 
      />
      
      {/* --- 3. RENDER THE NEW MODAL --- */}
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
        agenticMode={agenticMode}
        setAgenticMode={setAgenticMode}
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
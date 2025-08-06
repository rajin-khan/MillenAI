import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SettingsModal from './components/SettingsModal';

const App = () => {
  // Initialize state from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('millenai_settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      apiKey: '',
      enterToSend: true,
      darkMode: true,
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Effect to save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('millenai_settings', JSON.stringify(settings));
  }, [settings]);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <main className="flex w-full h-screen font-sans bg-[#0D1117]">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      <MainContent settings={settings} />

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
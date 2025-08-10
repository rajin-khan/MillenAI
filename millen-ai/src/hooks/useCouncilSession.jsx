// /millen-ai/src/hooks/useCouncilSession.jsx
import { useCouncilStore } from '../stores/councilStore';
import { toast } from 'sonner';

export const useCouncilSession = () => {
  const councilState = useCouncilStore();
  // A safer way to get settings that avoids errors if it's not set yet
  const getApiKey = () => {
    try {
      const settings = JSON.parse(localStorage.getItem('millenai_settings'));
      return settings?.apiKey || null;
    } catch (e) {
      return null;
    }
  };

  const askCouncil = async (prompt) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      toast.error('Please set your Groq API key in Settings first.');
      return;
    }
    if (!prompt.trim()) {
      toast.error('Please enter a topic for the Council to discuss.');
      return;
    }

    try {
      await councilState.startCouncilSession(prompt, apiKey);
    } catch (error) {
      toast.error(error.message);
      councilState.resetCouncil();
    }
  };
  
  const isProcessing = ['selecting', 'processing', 'synthesizing'].includes(councilState.sessionPhase);
  const canAskCouncil = !councilState.isCouncilActive && !!getApiKey();
  
  return { ...councilState, askCouncil, isProcessing, canAskCouncil };
};
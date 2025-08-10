// /millen-ai/src/stores/councilStore.js
import { create } from 'zustand';
import { toast } from 'sonner';

export const useCouncilStore = create(
  (set, get) => ({
    // Session State
    isCouncilActive: false,
    sessionPhase: 'idle', 
    phaseMessage: '',
    currentSession: null,
    activeMembers: [],
    memberStatuses: {}, // { [modelId]: { status } }
    synthesisResult: '',
    
    // UI State
    showIndividualResponses: true, // <-- CHANGE 1: Set the default to true
    
    // Actions
    startCouncilSession: async (prompt, apiKey) => {
      set({ 
        isCouncilActive: true, 
        sessionPhase: 'selecting', 
        phaseMessage: 'The Council is Discussing...',
        currentSession: { id: Date.now(), prompt }, 
        synthesisResult: '', 
        memberStatuses: {},
        activeMembers: [],
        showIndividualResponses: true, // <-- CHANGE 2: Ensure it's true for new sessions
      });

      try {
        const response = await fetch('/api/council', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, apiKey }),
        });

        if (!response.ok || !response.body) {
            throw new Error('Failed to start council session.');
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
            for (const line of lines) {
                const data = JSON.parse(line.substring(6));
                get().handleCouncilUpdate(data);
            }
        }
      } catch (error) {
        set({ sessionPhase: 'error', phaseMessage: 'An error occurred.', synthesisResult: error.message });
      }
    },

    handleCouncilUpdate: (update) => {
      const { type, data } = update;
      set(state => {
        switch (type) {
          case 'phase':
            return { sessionPhase: data.phase, phaseMessage: data.message };
          case 'members_selected':
            return { activeMembers: data.members, memberStatuses: data.members.reduce((acc, member) => ({...acc, [member.id]: { status: 'pending' }}), {}) };
          case 'member_status':
            return {
              memberStatuses: { ...state.memberStatuses, [data.memberId]: { status: data.status } }
            };
          case 'synthesis_complete':
            return {
              sessionPhase: 'complete',
              phaseMessage: 'The Council has Delivered Its Results.',
              synthesisResult: data.synthesis,
            };
          case 'error':
            return { sessionPhase: 'error', phaseMessage: 'An error occurred.', synthesisResult: data.message };
          default:
            return {};
        }
      });
    },
    
    resetCouncil: () => set({ isCouncilActive: false, sessionPhase: 'idle' }),
    toggleIndividualResponses: () => set(state => ({ showIndividualResponses: !state.showIndividualResponses })),
  })
);
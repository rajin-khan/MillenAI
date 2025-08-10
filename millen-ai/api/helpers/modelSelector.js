// /millen-ai/api/helpers/modelSelector.js
export class ModelSelector {
  constructor() {
    this.models = {
      'compound-beta': { 
        id: 'compound-beta', 
        role: 'The Researcher', 
        avatar: '🌐', 
        color: '#10b981', 
        allocatedTokens: 4096, // Focused on gathering raw data
        priority: 0 
      },
      'llama-3.1-8b-instant': { 
        id: 'llama-3.1-8b-instant', 
        role: 'The Analyst', 
        avatar: '🔍', 
        color: '#3b82f6', 
        allocatedTokens: 2048, // Summarizes the research
        priority: 1
      },
      'llama-3.3-70b-versatile': { 
        id: 'llama-3.3-70b-versatile', 
        role: 'The Philosopher', 
        avatar: '🧙‍♂️', 
        color: '#8b5cf6', 
        allocatedTokens: 2048, // Provides a contrarian view
        priority: 2
      },
      'openai/gpt-oss-120b': { 
        id: 'openai/gpt-oss-120b', 
        role: 'The Judge', 
        avatar: '⚖️', // New avatar for the final verdict
        color: '#ec4899', 
        allocatedTokens: 4096, // Needs enough tokens for final synthesis
        priority: 3 
      },
    };
  }

  async selectOptimalModels() {
    const council = Object.values(this.models);
    council.sort((a, b) => a.priority - b.priority);
    return council;
  }
}
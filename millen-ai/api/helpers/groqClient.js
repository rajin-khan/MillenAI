// /millen-ai/api/helpers/groqClient.js
export class GroqClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.groq.com/openai/v1';
  }

  async chat(payload) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Failed to parse error from Groq API' } }));
      throw new Error(`Groq API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
    }
    return response.json();
  }
}
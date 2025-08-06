import Groq from 'groq-sdk';

/**
 * Creates a standard Groq client instance.
 * @param {string} apiKey - The user's Groq API key.
 * @returns {Groq} A Groq client instance.
 */
const createGroqClient = (apiKey) => {
  return new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
};

/**
 * API call logic for llama-3.1-8b-instant that returns a stream.
 * @param {string} apiKey - The user's Groq API key.
 * @param {Array<object>} messages - The conversation history.
 * @returns {Promise<Stream>} A stream object from the Groq SDK.
 */
async function streamLlama3_1_8b_instant(apiKey, messages) {
  const groq = createGroqClient(apiKey);
  return groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: messages,
    stream: true,
  });
}

/**
 * API call logic for llama-3.3-70b-versatile that returns a stream.
 * @param {string} apiKey - The user's Groq API key.
 * @param {Array<object>} messages - The conversation history.
 * @returns {Promise<Stream>} A stream object from the Groq SDK.
 */
async function streamLlama3_3_70b_versatile(apiKey, messages) {
  const groq = createGroqClient(apiKey);
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: messages,
    stream: true,
  });
}

/**
 * The main API dispatcher. Selects the correct streaming function.
 * @param {string} modelName - The identifier for the selected model.
 * @param {string} apiKey - The user's API key.
 * @param {Array<object>} messages - The conversation history.
 * @returns {Promise<Stream>} The AI's response as a stream.
 */
export async function getGroqCompletionStream(modelName, apiKey, messages) {
  switch (modelName) {
    case 'llama-3.1-8b-instant':
      return streamLlama3_1_8b_instant(apiKey, messages);

    case 'llama-3.3-70b-versatile':
      return streamLlama3_3_70b_versatile(apiKey, messages);

    case 'openai/gpt-oss-120b':
    case 'openai/gpt-oss-20b':
      throw new Error(`The model "${modelName}" is not yet implemented.`);
      
    default:
      throw new Error(`Unknown or unsupported model selected: ${modelName}`);
  }
}
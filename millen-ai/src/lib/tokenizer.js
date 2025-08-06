import { get_encoding } from "tiktoken";

// Initialize the tokenizer once. 'cl100k_base' is the encoding used by GPT-3.5, GPT-4, and Llama models.
const encoding = get_encoding("cl100k_base");

/**
 * Counts the total number of tokens in an array of messages.
 * @param {Array<object>} messages - The array of chat messages.
 * @returns {number} The total token count.
 */
export function countTokens(messages) {
  let totalTokens = 0;
  for (const message of messages) {
    // Every message has a role and content, both of which are tokenized.
    const roleTokens = encoding.encode(message.role);
    const contentTokens = encoding.encode(message.content);
    totalTokens += roleTokens.length + contentTokens.length;
  }
  return totalTokens;
}
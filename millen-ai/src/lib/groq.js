/**
 * The main API dispatcher. Sends a payload to our secure serverless function
 * and awaits a complete JSON response.
 * @param {string} apiKey - The user's API key.
 * @param {object} payload - The complete request object for the Groq API.
 * @returns {Promise<object>} The full completion object from the Groq API.
 */
export async function getGroqCompletion(apiKey, payload) {
  const response = await fetch('/api/groq', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: apiKey,
      payload: payload,
    }),
  });

  if (!response.ok) {
    // Await the error message from the serverless function's JSON response
    const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
    throw new Error(errorData.error || `API request failed with status ${response.status}`);
  }

  // Expect and parse a single JSON object for the successful response.
  return response.json();
}
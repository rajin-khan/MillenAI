import Groq from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { apiKey, payload } = req.body;

    if (!apiKey || !payload) {
      return res.status(400).json({ error: "API key and payload are required." });
    }
    
    const groq = new Groq({ apiKey });

    // The key change: We set `stream: false` and `await` the entire completion object.
    const completion = await groq.chat.completions.create({
      ...payload,
      stream: false, 
    });

    // Send the complete response back as a single JSON object.
    res.status(200).json(completion);

  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: "An error occurred on the server." });
  }
}
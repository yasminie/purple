// pages/api/llama.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, chatLog } = req.body; // Retrieve chatLog from the request body

    // Validate the prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid or missing "prompt" in request body.' });
    }

    try {
      // Map chatLog entries to the expected format for Groq's Llama API
      const messages = chatLog.map((entry) => ({
        role: entry.type === 'user' ? 'user' : 'assistant',
        content: entry.message,
      }));

      // Add the latest user prompt
      messages.push({ role: 'user', content: prompt });

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          messages,
          model: 'llama3-8b-8192',
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: false,
          stop: null,
        }),
      });

      if (!groqResponse.ok) {
        const errorData = await groqResponse.json();
        throw new Error(errorData.error || 'Failed to fetch response from Groq.');
      }

      const data = await groqResponse.json();
      const aiResponse = data.choices && data.choices.length > 0
        ? data.choices[0].message.content.trim()
        : 'No response generated from Groq.';

      res.status(200).json({ response: aiResponse });
    } catch (error) {
      console.error('Groq API Error:', error);
      res.status(500).json({ error: 'Failed to fetch response from Groq.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

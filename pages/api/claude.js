// pages/api/claude.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, chatLog } = req.body; // Retrieve chatLog from the request body

    // Validate the prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: 'Invalid prompt provided.' });
    }

    try {
      // Map chatLog entries to the expected format for Claude's API
      const messages = chatLog.map((entry) => ({
        role: entry.type === 'user' ? 'user' : 'assistant',
        content: entry.message,
      }));

      // Add the latest user prompt
      messages.push({ role: 'user', content: prompt });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'X-API-Key': process.env.ANTHROPIC_API_KEY,
        },
        body: JSON.stringify({
          messages,
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res
          .status(response.status)
          .json({ error: errorData.error.message || 'Failed to fetch response from Claude AI.' });
      }

      const data = await response.json();
      const aiResponse = data.content
        .filter((item) => item.type === 'text')
        .map((item) => item.text)
        .join(' ')
        .trim();

      if (!aiResponse) {
        return res.status(500).json({ error: 'No valid response from Claude AI.' });
      }

      res.status(200).json({ response: aiResponse });
    } catch (error) {
      console.error('Claude AI API Error:', error.message);
      res.status(500).json({ error: error.message || 'Failed to fetch response from Claude AI.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

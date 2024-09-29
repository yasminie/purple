// pages/api/chatgpt.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, chatLog } = req.body; // Retrieve chatLog from the request body

    // Validate the prompt
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt provided.' });
    }

    try {
      // Map chatLog entries to the format expected by OpenAI's API
      const messages = chatLog.map((entry) => ({
        role: entry.type === 'user' ? 'user' : 'assistant',
        content: entry.message,
      }));

      // Add the latest user prompt
      messages.push({ role: 'user', content: prompt });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch response from OpenAI.');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content.trim();

      if (!aiResponse) {
        return res.status(500).json({ error: 'No response from OpenAI.' });
      }

      res.status(200).json({ response: aiResponse });
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      res.status(500).json({ error: error.message || 'Failed to fetch response from ChatGPT.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
      let { prompt } = req.body;
  
      // Validate the prompt
      if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.status(400).json({ error: 'Invalid prompt provided.' });
      }
  
      // Define the system prompt separately
      const systemMessage = 'You are Claude, an AI assistant.'; // Optional, customize as needed
  
      // Format the user message
      const messages = [{ role: 'user', content: prompt }];
  
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01', // Ensure this header is correct per the API requirements
            'X-API-Key': process.env.ANTHROPIC_API_KEY, // Ensure your API key is set correctly
          },
          body: JSON.stringify({
            system: systemMessage, // Set the system message here
            messages: messages, // Structured message format without a "system" role
            model: 'claude-3-5-sonnet-20240620', // Ensure the correct model is used as per API documentation
            max_tokens: 1024, // Include the required max_tokens field
            temperature: 0.7, // Adjust for creativity
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Claude AI API Error Response:', JSON.stringify(errorData, null, 2));
          return res
            .status(response.status)
            .json({ error: errorData.error.message || 'Failed to fetch response from Claude AI.' });
        }
  
        const data = await response.json();
  
        // Extract the response text from the content array
        const aiResponse = data.content
          .filter((item) => item.type === 'text')
          .map((item) => item.text)
          .join(' ')
          .trim();
  
        if (!aiResponse) {
          return res.status(500).json({ error: 'No valid response from Claude AI.' });
        }
  
        // Return the response to the client
        return res.status(200).json({ response: aiResponse });
      } catch (error) {
        console.error('Claude AI API Error:', error.message || error);
        return res.status(500).json({ error: error.message || 'Failed to fetch response from Claude AI.' });
      }
    } else {
      // Handle unsupported HTTP methods
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  }
  
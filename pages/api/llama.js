// pages/api/llama.js

// Fetch is globally available in Node.js v18 or later. 
// Ensure the required environment variables are set up correctly.

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        // Log the incoming request body for debugging purposes
        console.log('Received request body:', req.body);
  
        // Extract the prompt from the request body
        const { prompt } = req.body;
  
        // Input Validation: Ensure the prompt is valid
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
          return res.status(400).json({ error: 'Invalid or missing "prompt" in request body.' });
        }
  
        // Request configuration for Groq's Llama3 API
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: prompt.trim(),
              },
            ],
            model: 'llama3-8b-8192',
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: false, // Streaming disabled for simplicity
            stop: null,
          }),
        });
  
        // Check if the API call was successful
        if (!groqResponse.ok) {
          // Attempt to parse and log the error details from Groq's response
          const errorData = await groqResponse.json();
          throw new Error(errorData.error || 'Failed to fetch response from Groq.');
        }
  
        // Parse the response from Groq's API
        const data = await groqResponse.json();
  
        // Extract the AI response text, ensuring it follows the expected structure
        const aiResponse = data.choices && data.choices.length > 0
          ? data.choices[0].message.content.trim()
          : 'No response generated from Groq.';
  
        // Return the response to the client
        return res.status(200).json({ response: aiResponse });
  
      } catch (error) {
        // Log any errors encountered during processing
        console.error('Groq API Error:', error);
  
        // Check if headers were already sent to avoid response errors
        if (res.writableEnded) {
          res.end();
        } else {
          // Respond with a generic error message if something went wrong
          res.status(500).json({ error: 'Failed to fetch response from Groq.' });
        }
      }
    } else {
      // Handle unsupported HTTP methods
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  }
  
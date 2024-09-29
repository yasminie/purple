import fetch from 'node-fetch';

export async function getClaudeResponse(prompt, conversationMessages, userFirstName) {
  // Optional system prompt (ensure it's always a string)
  let systemPrompt = ''; // If you want to provide a default, you can change it here
  systemPrompt = systemPrompt || '';  // Default to an empty string if undefined

  // Begin constructing the prompt for Claude, and ensure it's a valid string
  let promptForClaude = '';

  // Safely check and include systemPrompt if it's a valid string
  if (typeof systemPrompt === 'string' && systemPrompt.trim().length > 0) {
    promptForClaude += systemPrompt.trim();
  }

  // Ensure the prompt starts with "\n\nuser:"
  promptForClaude += '\n\nuser:';

  // Build the conversation history safely
  const conversationParts = [];

  // Append previous messages
  if (Array.isArray(conversationMessages)) {
    conversationMessages.forEach((msg) => {
      const role = msg.sender === userFirstName ? 'user' : 'assistant';
      conversationParts.push({ role: role, content: msg.text });
    });
  }

  // Safely handle the prompt to ensure it's a valid string
  if (typeof prompt === 'string' && prompt.trim()) {
    conversationParts.push({ role: 'user', content: prompt.trim() });
  } else {
    throw new Error('Prompt is invalid or missing.');
  }

  // Assign conversationParts to messages
  const messages = conversationParts;

  // **Update the model name to the correct one**
  const modelName = 'claude-3-5-sonnet-20240620'; // The correct model name

  try {
    // Send the request to Claude's Messages API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01', // Ensure this matches the version you have access to
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages, // Send the entire conversation history
        max_tokens: 1024,   // Required field for maximum tokens in the response
        temperature: 0.7,
        stop_sequences: ['\n\nuser:', '\n\nassistant:'], // Update stop sequences if necessary
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Log and throw the error message returned by the API
      console.error('Claude API Response Error:', errorData);
      throw new Error(errorData.error?.message || JSON.stringify(errorData) || 'Failed to fetch response from Claude AI.');
    }

    const data = await response.json();
    console.log('Claude API Full Response:', data); // Log the entire API response

    // Extract the AI's response from the `content` array
    const aiResponse = data.content && data.content.length > 0
      ? data.content.map(c => c.text).join(' ').trim()
      : null;

    if (!aiResponse) {
      console.error('Claude AI API Error: No response from Claude AI. Full data:', data); // Log the full data to understand the issue
      throw new Error('No response from Claude AI.');
    }

    return aiResponse;

  } catch (error) {
    console.error('Claude AI API Error Stack:', error.stack || error);
    throw error;
  }
}

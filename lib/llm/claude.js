// lib/llm/claude.js

import fetch from 'node-fetch';

export async function getClaudeResponse(prompt, conversationMessages, userFirstName) {
  // Optional system prompt (set it if you have one)
  let systemPrompt = ''; // e.g., "You are a helpful assistant."

  // Begin constructing the prompt
  let promptForClaude = '';

  // Include system prompt if present
  if (systemPrompt.trim().length > 0) {
    promptForClaude += systemPrompt.trim();
  }

  // Ensure the prompt starts with "\n\nHuman:"
  promptForClaude += '\n\nHuman:';

  // Build the conversation
  const conversationParts = [];

  // Append previous messages
  conversationMessages.forEach((msg) => {
    const role = msg.sender === userFirstName ? 'Human' : 'Assistant';
    conversationParts.push(`${role}: ${msg.text}`);
  });

  // Append the latest user prompt
  conversationParts.push(`Human: ${prompt}`);

  // Indicate that we're awaiting the assistant's response
  conversationParts.push('Assistant:');

  // Join the conversation parts with double newlines
  const conversationText = conversationParts.join('\n\n');

  // Complete the prompt
  promptForClaude += conversationText;

  // **Update the model name to the correct one**
  const modelName = 'claude-v1.3'; // Replace with the correct model name

  // Send the request to Claude's API
  const response = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01', // Ensure this matches the version you have access to
    },
    body: JSON.stringify({
      prompt: promptForClaude,
      model: modelName,
      max_tokens_to_sample: 1024,
      temperature: 0.7,
      stop_sequences: ['\n\nHuman:', '\n\nAssistant:'],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Throw the error message returned by the API
    throw new Error(errorData.error?.message || JSON.stringify(errorData) || 'Failed to fetch response from Claude AI.');
  }

  const data = await response.json();
  const aiResponse = data.completion.trim();

  if (!aiResponse) {
    throw new Error('No response from Claude AI.');
  }

  return aiResponse;
}



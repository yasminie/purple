// lib/llm/llama.js

import fetch from 'node-fetch';

export async function getLlamaResponse(prompt, conversationMessages, userFirstName) {
  const messages = conversationMessages.map((msg) => ({
    role: msg.sender === userFirstName ? 'user' : 'assistant',
    content: msg.text,
  }));

  // Add the latest user prompt
  messages.push({ role: 'user', content: prompt });

  const llamaResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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

  if (!llamaResponse.ok) {
    const errorData = await llamaResponse.json();
    throw new Error(errorData.error || 'Failed to fetch response from Llama API.');
  }

  const data = await llamaResponse.json();
  const aiResponse =
    data.choices && data.choices.length > 0
      ? data.choices[0].message.content.trim()
      : 'No response generated from Llama API.';

  if (!aiResponse) {
    throw new Error('No response from Llama API.');
  }

  return aiResponse;
}

// lib/llm/chatgpt.js

import fetch from 'node-fetch';

export async function getChatGPTResponse(prompt, conversationMessages) {
  const messages = conversationMessages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text,
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
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch response from OpenAI.');
  }

  const data = await response.json();
  const aiResponse = data.choices[0]?.message?.content.trim();

  if (!aiResponse) {
    throw new Error('No response from OpenAI.');
  }

  return aiResponse;
}

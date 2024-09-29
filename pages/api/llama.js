// pages/api/llama.js

import dbConnect from '../../lib/mongodb';
import { getUserFromSession } from '../../lib/getUserFromSession';
import { getLlamaResponse } from '../../lib/llm/llama';

export default async function handler(req, res) {
  await dbConnect();

  const user = await getUserFromSession(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { prompt, activeConversationId } = req.body;

  // Validate the prompt
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing "prompt" in request body.' });
  }

  try {
    // Find the conversation
    const conversation = user.userdata.conversations.find(
      (conv) => conv.conversationId.toString() === activeConversationId
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    // Get the AI response using the utility function
    const aiResponse = await getLlamaResponse(prompt, conversation.messages, user.firstName);

    // Save the new messages to the conversation
    conversation.messages.push(
      { sender: user.firstName, text: prompt },
      { sender: 'Llama', text: aiResponse }
    );
    await user.save();

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Llama API Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to fetch response from Llama API.' });
  }
}



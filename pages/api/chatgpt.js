// pages/api/chatgpt.js

import dbConnect from '../../lib/mongodb';
import { getUserFromSession } from '../../lib/getUserFromSession';
import User from '../../models/User';
import { getChatGPTResponse } from '../../lib/llm/chatgpt';

export default async function handler(req, res) {
  await dbConnect();

  // Get the user's session
  const user = await getUserFromSession(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { prompt, activeConversationId } = req.body;

  // Validate the prompt
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt provided.' });
  }

  try {
    // Find the conversation
    const conversation = user.userdata.conversations.find(
      (conv) => conv.conversationId.toString() === activeConversationId
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    // Get the AI response
    const aiResponse = await getChatGPTResponse(prompt, conversation.messages);

    // Save the new messages to the conversation
    conversation.messages.push(
      { sender: user.firstName, text: prompt },
      { sender: 'ChatGPT', text: aiResponse }
    );
    await user.save();

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to fetch response from ChatGPT.' });
  }
}

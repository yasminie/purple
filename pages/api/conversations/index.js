// pages/api/conversations/index.js

import dbConnect from '../../../lib/mongodb';
import { getUserFromSession } from '../../../lib/getUserFromSession';
import User from '../../../models/User';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await dbConnect();

  const user = await getUserFromSession(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log('Request Method:', req.method);

  if (req.method === 'GET') {
    try {
      // Get the user's conversations
      const conversations = user.userdata.conversations.map((conv) => ({
        ...conv.toObject(),
        conversationId: conv.conversationId.toString(), // Convert to string
      }));  

      return res.status(200).json({ conversations });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { selectedOption } = req.body;

      // Create a new conversation
      const newConversation = {
        conversationId: new mongoose.Types.ObjectId(),
        participants: [user.firstName, selectedOption || 'LLM'],
        messages: [],
      };

      // Update the user document
      user.userdata.conversations.push(newConversation);
      await user.save();

      // Return the new conversation with conversationId as a string
      return res.status(201).json({
        conversation: {
          ...newConversation,
          conversationId: newConversation.conversationId.toString(),
        },
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}


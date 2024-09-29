// models/User.js
import mongoose from 'mongoose';

// Define the message schema for embedding inside conversations
const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // Will be either user's firstName or the LLM name
  text: { type: String, required: true },
});

// Define the conversation schema
const ConversationSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(), // Use a function here
  },
  participants: [{ type: String, required: true }],
  messages: [MessageSchema],
});

// Define the main User schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userdata: {
    conversations: [ConversationSchema] // Embedding the conversations inside userdata
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

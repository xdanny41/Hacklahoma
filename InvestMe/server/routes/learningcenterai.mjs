// server/routes/conversation.js
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize the OpenAI client with your credentials
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});

router.post('/conversation', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Ensure messages are provided as an array
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages must be provided as an array.' });
    }

    // Add a system message to set the role and tone for the conversation
    const systemMessage = {
      role: 'system',
      content: 'You are an experienced investor dedicated to helping beginners learn about investing and trading. Provide clear, concise, and beginner-friendly advice, thinking like an investor while explaining concepts in simple terms.'
    };

    // Prepend the system message to the conversation history
    const fullMessages = [systemMessage, ...messages];

    // Call the Chat Completion API with the full conversation history
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: fullMessages,
      max_tokens: 150,
      temperature: 0.7,
    });

    res.json({ result: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error in /api/openai/conversation:', error);
    res.status(500).json({ error: 'Failed to process conversation.' });
  }
});

export default router;

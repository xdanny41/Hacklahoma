// server/routes/openai.js
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize the OpenAI client with your credentials
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG, // Or use "project" if that’s what you prefer
});

router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `You're a bot that helps beginner investors learn how to trade in the stock market. Analyze the text and explain in beginner terms:

"${text}"

Provide a brief sentiment summary and a plain language explanation.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    res.json({ result: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error in /api/openai/analyze:', error);
    res.status(500).json({ error: 'Failed to analyze the text.' });
  }
});

export default router;

import { Anthropic } from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: messages,
    });
    
    return res.status(200).json({ 
      message: response.content[0].text 
    });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return res.status(500).json({ error: 'Failed to communicate with Claude' });
  }
} 
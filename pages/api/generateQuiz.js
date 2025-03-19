import { Anthropic } from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { industry } = req.body;
  
  if (!industry) {
    return res.status(400).json({ error: 'Industry is required' });
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const prompt = `
      You are an expert in pricing strategies for the ${industry} industry. Create 8 multiple-choice questions 
      about pricing scenarios, challenges, and strategies specific to the ${industry} industry.
      
      For each question:
      1. Provide a realistic scenario a pricing practitioner might face
      2. Create 4 possible answer choices labeled A, B, C, and D
      3. Indicate which answer is correct
      4. Include a brief explanation for why the answer is correct
      
      Format your response as a JSON array with this structure:
      [
        {
          "question": "Scenario question text here",
          "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
          "correctAnswerIndex": 0, // Index of correct answer, where 0 = A, 1 = B, etc.
          "explanation": "Explanation of why the correct answer is best"
        },
        // ...repeat for all 8 questions
      ]
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4000,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    });

    let questions;
    try {
      // Extract the JSON from the response
      const jsonMatch = response.content[0].text.match(/```json\n([\s\S]*?)\n```/) || 
                        response.content[0].text.match(/\[([\s\S]*?)\]/);
                        
      const jsonString = jsonMatch ? jsonMatch[1] : response.content[0].text;
      questions = JSON.parse(jsonString.includes('[') ? jsonString : `[${jsonString}]`);
      
      // Validate question format
      questions = questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation
      })).slice(0, 8); // Ensure we have exactly 8 questions
      
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      return res.status(500).json({ error: 'Failed to parse quiz questions' });
    }

    return res.status(200).json({ questions });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return res.status(500).json({ error: 'Failed to generate quiz' });
  }
} 
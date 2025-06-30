import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend API
});

export const sendChatMessage = async (messages: Array<{role: 'user' | 'assistant', content: string}>) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'No response received';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to get response from OpenAI');
  }
};
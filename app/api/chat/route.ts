import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversationHistory: { role: string; content: string }[] = [];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    conversationHistory.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...conversationHistory.map((msg) => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
        })),
      ],
    });

    const assistantMessage = response.choices[0]?.message?.content ?? '';

    conversationHistory.push({ role: 'assistant', content: assistantMessage });

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
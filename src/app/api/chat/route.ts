import { VertexAI } from '@google-cloud/vertexai';
import { NextResponse } from 'next/server';

const vertexAI = new VertexAI({
  project: 'carta-496507',
  location: 'us-central1',
});

// Use gemini-1.5-flash for general chat
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash-001',
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const request = {
      contents: [
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ]
    };
    
    const result = await generativeModel.generateContent(request);
    
    if (result.response.candidates && result.response.candidates.length > 0) {
      const text = result.response.candidates[0].content.parts[0].text;
      return NextResponse.json({ response: text });
    } else {
       return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

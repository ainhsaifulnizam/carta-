import { VertexAI } from '@google-cloud/vertexai';
import { NextResponse } from 'next/server';

const vertexAI = new VertexAI({
  project: 'carta-496507',
  location: 'us-central1',
});

const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-3.0-flash',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contents, system_instruction } = body;
    
    if (!contents || !Array.isArray(contents)) {
      return NextResponse.json({ error: 'Contents array is required' }, { status: 400 });
    }

    const request: any = {
      contents: contents,
    };

    if (system_instruction) {
      request.systemInstruction = system_instruction;
    }
    
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


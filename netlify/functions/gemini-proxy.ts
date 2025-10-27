import { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const { model, contents, config } = JSON.parse(event.body || '{}');

    if (!model || !contents) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing model or contents in request body' }) };
    }

    const result = await ai.models.generateContent({ model, contents, config });
    const response = { text: result.text };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error calling Gemini API:', error);
    return { statusCode: 500, body: JSON.stringify({ error: `Internal Server Error: ${errorMessage}` }) };
  }
};

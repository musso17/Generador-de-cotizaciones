import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_ALIASES = {
  'gemini-2.5-pro-latest': 'gemini-2.5-pro',
  'gemini-2.5-flash-latest': 'gemini-2.5-flash',
  'gemini-2.0-pro-latest': 'gemini-2.0-pro',
  'gemini-2.0-flash-latest': 'gemini-2.0-flash',
  'gemini-1.5-pro-latest': 'gemini-1.5-pro',
  'gemini-1.5-flash-latest': 'gemini-1.5-flash',
  'gemini-pro': 'gemini-2.5-pro',
  'gemini-flash': 'gemini-2.5-flash',
};

export async function POST(req) {
  try {
    if (!GEMINI_API_KEY) {
      return Response.json(
        { error: 'GEMINI_API_KEY no está configurado en el servidor.' },
        { status: 500 }
      );
    }

    const { model: modelName, contents, config } = await req.json();

    if (!modelName || !contents) {
      return Response.json(
        { error: 'La solicitud al proxy debe incluir "model" y "contents".' },
        { status: 400 }
      );
    }

    const resolvedModel = MODEL_ALIASES[modelName] ?? modelName;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: resolvedModel });

    const result = await model.generateContent({
      contents,
      generationConfig: config,
    });

    const response = await result.response;

    return Response.json({
      candidates: response.candidates ?? [],
      promptFeedback: response.promptFeedback ?? null,
    });
  } catch (error) {
    console.error('Error in Gemini proxy:', error);
    return Response.json(
      { error: 'Error al generar la respuesta con Gemini' },
      { status: 500 }
    );
  }
}

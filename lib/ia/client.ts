import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY não configurada");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export function getModel() {
  return genAI.getGenerativeModel({ model: MODEL });
}

export async function gerarTexto(prompt: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

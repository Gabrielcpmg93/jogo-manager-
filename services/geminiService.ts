import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  try {
    // Safety check for process.env to prevent ReferenceError in some browser environments
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : null;
    
    if (!apiKey) {
      console.warn("API_KEY not found in environment variables.");
      return null;
    }
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Error initializing AI client:", e);
    return null;
  }
};

export const generateMatchCommentary = async (
  userTeam: string,
  oppTeam: string,
  scoreUser: number,
  scoreOpp: number,
  events: string[]
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Narração indisponível (Chave API não configurada).";

  const prompt = `
    Você é um narrador de futebol brasileiro emocionante e energético (estilo Galvão Bueno ou Luis Roberto).
    Escreva um resumo curto e emocionante (máximo 3 parágrafos) de uma partida de futebol.
    
    Time da Casa: ${userTeam}
    Visitante: ${oppTeam}
    Placar Final: ${scoreUser} x ${scoreOpp}
    
    Momentos Chave:
    ${events.join('\n')}
    
    Use girias de futebol brasileiro, seja dramático!
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Sem comentários disponíveis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "O narrador perdeu a voz! (Erro na API)";
  }
};

export const generateScoutReport = async (playerDescription: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "Olheiro indisponível.";

    const prompt = `Você é um olheiro de futebol profissional. Forneça uma análise tática curta (2 frases) sobre um jogador com estas características: ${playerDescription}. Diga se vale a pena o investimento.`;

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        return response.text || "Sem análise.";
      } catch (error) {
        return "Erro ao contatar olheiro.";
      }
}
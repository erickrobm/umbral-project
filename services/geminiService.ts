import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// System instruction updated for Spanish and new context
let chatSession: Chat | null = null;
let currentChatUser: string | null = null;

const getSystemInstruction = (userName: string) => `Eres Umbral AI, un asistente financiero empático y útil integrado en la aplicación "Umbral Finanzas".
Tu objetivo es ayudar al usuario ${userName} a alcanzar sus metas financieras, especialmente su "Primer Millón".
El usuario puede cambiar entre MXN (Pesos Mexicanos) y USD (Dólares). Adapta tus respuestas a la moneda que el usuario mencione o asume la configurada.
Usa un tono alentador, conciso y financieramente prudente.
Usa markdown para formatear tus respuestas (negritas, listas, etc.).
Idioma: Español.`;

export const getChatSession = (userName: string = 'Usuario'): Chat => {
  if (!chatSession || currentChatUser !== userName) {
    const ai = new GoogleGenAI({ apiKey });
    chatSession = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: getSystemInstruction(userName),
      },
      history: [
        {
          role: "model",
          parts: [{ text: `Hola ${userName}, soy Umbral AI. ¿En qué puedo ayudarte con tus finanzas hoy?` }],
        },
      ],
    });
    currentChatUser = userName;
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string, userName: string = 'Usuario'): Promise<string> => {
  try {
    const chat = getChatSession(userName);
    const result = await chat.sendMessage({ message });
    return result.text || "No estoy seguro de cómo responder a eso en este momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, tengo problemas para conectarme con el servicio financiero. Por favor intenta más tarde.";
  }
};

export interface FinancialRates {
  usdRate: number;
  btcUsd: number;
  ethUsd: number;
}

export const getRealTimeFinancialData = async (): Promise<FinancialRates | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Fetch USD rate, BTC price and ETH price in one go
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        Por favor, obtén los valores de mercado EN TIEMPO REAL más recientes posibles para:
        1. Tipo de cambio USD a MXN (Pesos Mexicanos).
        2. Precio de Bitcoin (BTC) en USD.
        3. Precio de Ethereum (ETH) en USD.

        Tu respuesta DEBE ser EXCLUSIVAMENTE un objeto JSON válido sin texto adicional, sin bloques de código markdown, solo el JSON puro con este formato exacto:
        {
          "usdRate": number,
          "btcUsd": number,
          "ethUsd": number
        }
      `,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    console.log("Gemini Financial Data Response:", text); // Debug log
    if (text) {
      // Clean potential markdown code blocks if the model ignores the instruction
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanText);
      if (typeof data.usdRate === 'number' && typeof data.btcUsd === 'number' && typeof data.ethUsd === 'number') {
        return data as FinancialRates;
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching financial data from Gemini:", error);
    return null;
  }
};

export const getInvestmentInsight = async (
  portfolioSummary: string,
  marketData: FinancialRates
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
            Actúa como un asesor financiero experto y breve.
            Datos del mercado actual:
            - USD/MXN: ${marketData.usdRate}
            - BTC/USD: ${marketData.btcUsd}
            - ETH/USD: ${marketData.ethUsd}

            Portafolio del usuario:
            ${portfolioSummary}

            Dame UN SOLO párrafo corto (máximo 40 palabras) con una recomendación "insight" inteligente.
            Ejemplos: "¿Conviene pasar MXN a USD?", "¿Es momento de acumular BTC?", "¿Diversificar?".
            Sé directo, usa negritas para lo importante. No des consejos legales, solo observaciones financieras astutas basadas en si el usuario tiene mucho efectivo, o mucha cripto, etc.
        `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Revisa la diversificación de tu portafolio para mitigar riesgos.";
  } catch (e) {
    console.error(e);
    return "Mantén tu portafolio diversificado para reducir la volatilidad.";
  }
};
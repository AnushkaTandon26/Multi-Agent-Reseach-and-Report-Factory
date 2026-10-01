import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GenerateOptions {
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  apiKey?: string;
  modelName?: string;
  mockMode?: boolean;
}

export class AIService {
  /**
   * Generates text using Google Gemini API with exponential backoff retry.
   * If in mock mode, API key is missing, or API calls fail, gracefully falls back to local reasoning.
   */
  public static async generateText(
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<string> {
    const isMock = options.mockMode || process.env.MOCK_LLM === 'true';
    if (isMock) {
      return ''; // triggers agent local deterministic reasoning engine
    }

    const key = options.apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const modelName = options.modelName || 'gemini-1.5-flash';

    if (key && key.trim() !== '') {
      let attempts = 0;
      const maxAttempts = 2;
      let delayMs = 1000;

      while (attempts < maxAttempts) {
        try {
          const genAI = new GoogleGenerativeAI(key.trim());
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: options.temperature ?? 0.3,
              maxOutputTokens: options.maxOutputTokens ?? 4096,
            },
            systemInstruction: options.systemInstruction,
          });

          const result = await model.generateContent(prompt);
          const response = await result.response;
          return response.text();
        } catch (err: any) {
          attempts++;
          const isRateLimit = err?.status === 429 || (err?.message && /quota|rate|limit/i.test(err.message));
          console.warn(`[AIService] Attempt ${attempts} failed (${err?.message || err}). Retrying in ${delayMs}ms...`);
          
          if (attempts >= maxAttempts) {
            console.warn('[AIService] Max retry attempts exceeded. Falling back to local epistemic reasoning heuristics.');
            break;
          }

          await new Promise((res) => setTimeout(res, delayMs));
          delayMs *= 2;
        }
      }
    }

    // Graceful fallback to deterministic local intelligence
    return '';
  }

  /**
   * Extracts JSON block from text response with robust error recovery
   */
  public static parseJSONFromResponse<T>(text: string, fallback: T): T {
    if (!text || text.trim() === '') return fallback;

    try {
      // Find ```json or ``` block
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const cleanJson = jsonMatch ? jsonMatch[1].trim() : text.trim();
      return JSON.parse(cleanJson);
    } catch {
      try {
        // Try finding between first { and last } or first [ and last ]
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          return JSON.parse(text.substring(firstBrace, lastBrace + 1));
        }

        const firstBracket = text.indexOf('[');
        const lastBracket = text.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket > firstBracket) {
          return JSON.parse(text.substring(firstBracket, lastBracket + 1));
        }
      } catch {
        // fallback
      }
      return fallback;
    }
  }
}

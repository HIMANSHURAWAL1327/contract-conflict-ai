import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in the project settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export interface Conflict {
  contract1_clause: string;
  contract2_clause: string;
  explanation: string;
  severity: "low" | "medium" | "high";
  standardized_alternative: string;
}

export interface AnalysisResult {
  conflicts: Conflict[];
  summary: string;
  legal_suggestions: string[];
}

export async function analyzeContracts(text1: string, text2: string): Promise<AnalysisResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare the following two legal contracts and identify any conflicting clauses or contradictory statements. 
    1. Identify specific conflicts between the two documents.
    2. Provide a high-level summary of the discrepancies.
    3. Provide a list of general legal suggestions or best practices to harmonize these documents or improve their legal standing.
    
    Contract 1:
    ${text1}
    
    Contract 2:
    ${text2}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conflicts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                contract1_clause: { type: Type.STRING },
                contract2_clause: { type: Type.STRING },
                explanation: { type: Type.STRING },
                severity: { 
                  type: Type.STRING,
                  enum: ["low", "medium", "high"]
                },
                standardized_alternative: { type: Type.STRING }
              },
              required: ["contract1_clause", "contract2_clause", "explanation", "severity", "standardized_alternative"]
            }
          },
          summary: { type: Type.STRING },
          legal_suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["conflicts", "summary", "legal_suggestions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text);
}

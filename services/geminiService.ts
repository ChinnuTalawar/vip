import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  // In a real app, ensure this is handled securely.
  // For this demo, we assume process.env.API_KEY is injected.
  if (!process.env.API_KEY) {
    console.warn("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateEventDescription = async (eventName: string, keywords: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable: Please check API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a compelling, professional, yet inviting description for a volunteer event named "${eventName}". 
      Focus on these keywords/themes: ${keywords}. 
      Keep it under 50 words.`,
    });
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description.";
  }
};

export const findBestMatches = async (role: string, skills: string[]): Promise<string[]> => {
  const ai = getAiClient();
  if (!ai) return ["Service unavailable"];

  // Mock database of volunteers to search against (simulated for AI prompt)
  const volunteerPool = `
    1. John Doe: Construction, Heavy Lifting, Teamwork
    2. Jane Smith: Teaching, Coding, Mentorship
    3. Emily Davis: First Aid, Nursing, Caregiving
    4. Michael Brown: Driving, Logistics, Inventory
    5. Sarah Wilson: Event Planning, Social Media, Photography
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Given this volunteer pool: ${volunteerPool}
      
      And this open role: "${role}" requiring skills: [${skills.join(', ')}].
      
      Select the top 2 best matches. Return ONLY a JSON array of strings with their names and a 3-word reason.
      Example: ["John Doe (Strong teamwork skills)", "Michael Brown (Logistics experience)"]`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Matching Error", error);
    return ["Error performing AI match"];
  }
};
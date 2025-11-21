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

interface EventReportData {
  eventName: string;
  eventDate: string;
  location: string;
  description: string;
  totalVolunteers: number;
  totalSlots: number;
  attendanceRate: number;
}

interface GeneratedReport {
  executiveSummary: string;
  keyHighlights: string[];
  participantInsights: string;
  impactAnalysis: string;
  lessonsLearned: string[];
  recommendations: string[];
}

export const generateEventReport = async (eventData: EventReportData): Promise<GeneratedReport> => {
  const ai = getAiClient();
  if (!ai) {
    return {
      executiveSummary: "AI Service Unavailable",
      keyHighlights: [],
      participantInsights: "",
      impactAnalysis: "",
      lessonsLearned: [],
      recommendations: []
    };
  }

  try {
    const prompt = `Generate a comprehensive event report for the following completed volunteer event:

Event Name: ${eventData.eventName}
Date: ${eventData.eventDate}
Location: ${eventData.location}
Description: ${eventData.description}
Volunteers: ${eventData.totalVolunteers} out of ${eventData.totalSlots} slots filled
Attendance Rate: ${eventData.attendanceRate}%

Please provide:
1. Executive Summary (2-3 sentences)
2. Key Highlights (3-5 bullet points)
3. Participant Insights (1 paragraph about volunteer engagement and demographics)
4. Impact Analysis (1 paragraph about the event's community impact)
5. Lessons Learned (2-3 bullet points)
6. Recommendations for Future Events (2-3 bullet points)

Return as JSON with keys: executiveSummary, keyHighlights (array), participantInsights, impactAnalysis, lessonsLearned (array), recommendations (array)`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            keyHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            participantInsights: { type: Type.STRING },
            impactAnalysis: { type: Type.STRING },
            lessonsLearned: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["executiveSummary", "keyHighlights", "participantInsights", "impactAnalysis", "lessonsLearned", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Report Generation Error:", error);
    return {
      executiveSummary: "Error generating report summary.",
      keyHighlights: ["Report generation failed"],
      participantInsights: "Unable to analyze participant data.",
      impactAnalysis: "Unable to analyze event impact.",
      lessonsLearned: ["Error occurred during analysis"],
      recommendations: ["Please try again later"]
    };
  }
};
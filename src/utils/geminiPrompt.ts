export const buildPrompt = (interests: string, events: any[]) => `
You are an AI that recommends college events to students based on their interests.

Student Interests: ${interests}

Event List:
${JSON.stringify(events, null, 2)}

Return 3 events that best match the interests with a reason for each.
Format the result in JSON:
[
  {
    "title": "...",
    "reason": "...",
    "date": "...",
    "department": "...",
    "club": "...",
    "tags": ["..."],
    "score": 85
  }
]

Make sure the score is a number between 0-100 representing how well the event matches the student's interests.
`;

const API_KEY = "AIzaSyAQHV13IWcasv4hiDCvFXUAk3HQSCrbQ4I"; // ✅ For now only (change later)

export const getRecommendations = async (interests: string, events: any[]) => {
  const prompt = buildPrompt(interests, events);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      throw new Error("No text output from Gemini.");
    }

    const result = JSON.parse(output);
    console.log("✅ Gemini Recommendations:", result);
    return result;
  } catch (error) {
    console.error("❌ Error fetching recommendations:", error);
    return [];
  }
};

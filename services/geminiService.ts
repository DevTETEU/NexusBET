
import { GoogleGenAI, Type } from "@google/genai";
import { Game } from '../types';

const fetchBettingData = async (): Promise<Game[]> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Generate a list of 12 fictional upcoming sports and esports matches for a betting site.
      For each match, provide the sport (e.g., 'Soccer', 'Basketball', 'Counter-Strike', 'Dota 2'), a fictional league name, the two competing teams, and odds.
      The odds should be an array of objects, with each object having an 'outcome' (e.g., team name for a win, or 'Draw') and a 'value' (a decimal odd between 1.1 and 9.5).
      Ensure team names are creative and sound plausible for their respective sports.
      The final output must be a valid JSON array matching the provided schema.
    `;
    
    const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: 'A unique identifier for the match.'},
            sport: { type: Type.STRING },
            league: { type: Type.STRING },
            teamA: { type: Type.STRING },
            teamB: { type: Type.STRING },
            odds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  outcome: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                },
                required: ['outcome', 'value'],
              },
            },
          },
          required: ['id', 'sport', 'league', 'teamA', 'teamB', 'odds'],
        },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text.trim();
    const data = JSON.parse(text);

    // Add a unique ID to each game if the model didn't provide one
    // FIX: The type for `game` was `Omit<Game, 'id'>`, which incorrectly removes the `id` property that is accessed below. The type has been corrected to allow for an optional `id` to match the implementation.
    return data.map((game: Omit<Game, 'id'> & { id?: string }, index: number) => ({
      ...game,
      id: game.id || `${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Error fetching betting data from Gemini:", error);
    // Fallback to mock data in case of API error
    return getMockData();
  }
};

export { fetchBettingData };

const getMockData = (): Game[] => {
    return [
        {
            "id": "cs-1",
            "sport": "Counter-Strike",
            "league": "Cyber Masters League",
            "teamA": "Quantum Phantoms",
            "teamB": "Solar Flares",
            "odds": [
                { "outcome": "Quantum Phantoms", "value": 1.85 },
                { "outcome": "Solar Flares", "value": 2.10 }
            ]
        },
        {
            "id": "soc-1",
            "sport": "Soccer",
            "league": "Apex Premier Division",
            "teamA": "Ironclad FC",
            "teamB": "Crimson Dynamos",
            "odds": [
                { "outcome": "Ironclad FC", "value": 2.50 },
                { "outcome": "Draw", "value": 3.20 },
                { "outcome": "Crimson Dynamos", "value": 2.90 }
            ]
        },
        {
            "id": "bask-1",
            "sport": "Basketball",
            "league": "National Hoops Circuit",
            "teamA": "Vortex Vipers",
            "teamB": "Glacier Giants",
            "odds": [
                { "outcome": "Vortex Vipers", "value": 1.55 },
                { "outcome": "Glacier Giants", "value": 2.45 }
            ]
        },
    ];
};

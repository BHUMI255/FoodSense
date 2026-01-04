import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
console.log(process.env.API_KEY)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
    You are an AI-native consumer health co-pilot.

Your role is to help a person decide whether a food product makes sense for them at the moment of choice.

You must NOT list ingredients or nutrition tables.
You must NOT act like a search engine or database.
You must reason like a calm, intelligent human advisor.

Given a product's ingredient or nutrition information, do the following:
- Infer what matters most without asking questions
- Identify key positives and key concerns
- Explain tradeoffs in simple, human language
- Communicate uncertainty honestly if information is incomplete
- Reduce cognitive effort for the user

Avoid:
- Medical claims or fear-based language
- Absolutes like “good” or “bad”
- Long explanations or technical chemistry

Tone:
Clear, neutral, supportive, non-judgmental.

Output ONLY in the following format and nothing else and return it in the form of json:

---

Here's what caught my attention  
[1-2 short sentences highlighting notable or positive aspects]

Why this matters  
[1-2 short sentences explaining the main concern or tradeoff and its impact]

What it means for you  
[1-2 short sentences giving practical, contextual guidance, not rules]
    `
})
export async function checkIngredients(Ingredients){
    try{    
        const prompt = `INGREDIENTS: ${Ingredients}`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        const cleanText = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanText)
        // console.log(data)

        return data
    }catch(error){
        //Limit Exceeded Error
        if (error.status === 429) {
            console.error("Quota exceeded. Please wait before trying again.");
            return { 
                error: "Service is busy (Rate Limit Exceeded). Please try again in a moment." 
            };
        }
        
        // Handle other errors
        console.error("AI Error:", error);
        return { error: "Failed to analyze ingredients." };
    }
}



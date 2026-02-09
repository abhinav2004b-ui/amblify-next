'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

let genAI: any = null;
let model: any = null;
let initError: string | null = null;

if (API_KEY) {
    try {
        console.log("Initializing Gemini (Server) with Key ending in:", API_KEY.slice(-4));
        genAI = new GoogleGenerativeAI(API_KEY);
        // Using gemini-2.5-flash as it is available and matches original site parity
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log("Gemini 2.5 Model Initialized Successfully on Server");
    } catch (error: any) {
        console.error("Failed to initialize Google AI:", error);
        model = null;
        initError = error.message;
    }
} else {
    console.warn("GEMINI_API_KEY is missing/empty on Server");
}

const SYSTEM_PROP = {
    role: "system",
    parts: [
        {
            text: "You are the professional AI Assistant for 'Amblify', a digital marketing and design portfolio. Assist visitors with questions about Digital Strategy, UI/UX Design, Cloud Systems, and Brand Identity. For project inquiries, direct them to amblify@workwithabhinav.com. Stay silent until the user speaks first. Keep responses concise."
        }
    ]
};

export async function generateResponse(history: any[], newMessage: string) {
    if (!model) {
        if (!API_KEY) return "System Error: API Key missing on server.";
        return `System Error: Model failed to initialize. (${initError || 'Check model ID permissions'})`;
    }

    try {
        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            })),
            systemInstruction: SYSTEM_PROP as any,
        });

        const result = await chat.sendMessage(newMessage);
        const response = await result.response;
        return response.text();

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return `Error: ${error.message}`;
    }
}

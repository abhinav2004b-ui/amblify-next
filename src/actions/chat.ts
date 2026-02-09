'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

// Initialize the API logic
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;
let initError: string | null = null;

if (API_KEY) {
    try {
        console.log("Initializing Gemini (Server Action) with Key ending in:", API_KEY.slice(-4));
        genAI = new GoogleGenerativeAI(API_KEY);
        // Reverting to 1.5-flash to avoid Free Tier rate limits on 2.0
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Gemini 1.5 Model Initialized Successfully");
    } catch (error) {
        console.error("Failed to initialize Google AI:", error);
        model = null;
        initError = (error as Error).message;
    }
} else {
    console.error("GEMINI_API_KEY is missing/empty in server environment");
}

const SYSTEM_PROP = {
    role: "system",
    parts: [
        {
            text: "You are the professional AI Assistant for 'Amblify', a digital marketing and design portfolio. Assist visitors with questions about Digital Strategy, UI/UX Design, Cloud Systems, and Brand Identity. For project inquiries, direct them to amblify@workwithabhinav.com. Stay silent until the user speaks first. Keep responses concise."
        }
    ]
};

export async function generateResponse(history: { sender: string, text: string }[], newMessage: string) {
    if (!model) {
        if (!API_KEY) return "System Error: API Key missing on server.";
        return `System Error: Model failed to initialize. (${initError || 'Unknown Error'})`;
    }

    try {
        // Transform the simple history format to Gemini's expected Content format
        // Logic taken from original site: map user->user, model->model
        // Note: original site had 'role' in history but mapped from 'sender'. 
        // Here we map from input 'sender' to 'role' for Gemini SDK.
        const geminiHistory = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        const chat = model.startChat({
            history: geminiHistory,
            // Original site passed SYSTEM_PROP as systemInstruction
            // Explicitly cast to any to bypass potential type mismatch with strict SDK types if necessary
            systemInstruction: SYSTEM_PROP as any,
        });

        const result = await chat.sendMessage(newMessage);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("AI Generation Error:", error);
        // Match original error handling as close as possible
        return `Error: ${(error as Error).message}`;
    }
}

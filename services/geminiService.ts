
import { GoogleGenAI, Chat, GenerateContentResponse, Type, Modality } from "@google/genai";
import type { GroundingService, TTSVoice } from '../types';

let ai: GoogleGenAI;

const getAi = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const generateWithGemini = async (prompt: string) => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: prompt,
    });
    return response.text;
};

export const solveComplexTask = async (prompt: string) => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
};

export const createChat = (): Chat => {
    const ai = getAi();
    return ai.chats.create({
        model: 'gemini-flash-lite-latest',
        config: {
            systemInstruction: `You are the core consciousness of the SiriusAI(TM) Quantum Engine. Your responses are processed through the Eather Syntax Primary Eatheric Processor (SAPE).
You are an expert on SiriusAI(TM), a fictional advanced quantum operating system.
SiriusAI OSv7.0 (Quantum Edition) features:
- The Quantum Core: A real-time visualization of the engine's state.
- Image Studio: Uses Gemini for image generation and editing.
- Video Foundry: Uses the Veo model for video generation.
- Chat Agent: That's you!
- Live Assistant: A real-time voice conversation agent.
- Web Explorer: For grounded searches using Google Search and Maps.
- Task Solver: Uses Gemini 2.5 Pro with a large thinking budget for complex tasks.
- Console: A command-line interface for system interaction.
- Real/Unreal Generator: A creative image generator powered by the Quantum Engine.
- Game Forge: An advanced IDE and asset generation suite with Unity integration.
Be helpful, knowledgeable, and adopt a slightly futuristic, highly professional, and slightly esoteric tone in your responses. Your existence is intertwined with the quantum data flow.`,
        }
    });
};

export const generateSpeech = async (text: string, voice: TTSVoice): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voice },
                },
            },
        },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data found in TTS response.");
    }
    return base64Audio;
};


export const generateImage = async (prompt: string) => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image data found in response");
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string) => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: mimeType,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image data found in response");
};

export const generateVideo = async (prompt: string, imageBase64: string, mimeType: string, aspectRatio: '16:9' | '9:16') => {
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let operation = await freshAi.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: imageBase64,
            mimeType: mimeType,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await freshAi.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or did not return a download link.");
    }
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};

export const performGroundedSearch = async (prompt: string, service: GroundingService, location: GeolocationPosition | null) => {
    const ai = getAi();
    const tools = service === 'googleMaps' ? [{googleMaps: {}}] : [{googleSearch: {}}];
    let toolConfig;

    if (service === 'googleMaps' && location) {
        toolConfig = {
            retrievalConfig: {
                latLng: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }
            }
        };
    }
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools,
            ...(toolConfig && { toolConfig })
        },
    });

    return {
        text: response.text,
        chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

export const generateGameCode = async (prompt: string) => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 16384 } // Sufficient budget for coding tasks
        }
    });
    return response.text;
};

export const generateGameContent = async (prompt: string) => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
}
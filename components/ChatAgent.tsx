
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Spinner } from './shared/Spinner';
import { ChatIcon, SiriusIcon, UserIcon, MicIcon } from './shared/Icons';
import * as geminiService from '../services/geminiService';
import type { ChatMessage, TTSVoice } from '../types';
import { ToggleSwitch } from './shared/ToggleSwitch';

// FIX: Add type definition for the browser's SpeechRecognition API to resolve TS2304.
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// Audio decoding helpers
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const sampleRate = 24000; // Gemini TTS output sample rate
  const numChannels = 1;
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i * numChannels] / 32768.0;
  }
  return buffer;
}


export const ChatAgent: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);
    const [selectedVoice, setSelectedVoice] = useState<TTSVoice>('Puck');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    
    const ttsVoices: { id: TTSVoice, name: string }[] = [
        { id: 'Puck', name: 'Puck' },
        { id: 'Kore', name: 'Kore' },
        { id: 'Charon', name: 'Charon' },
        { id: 'Fenrir', name: 'Fenrir' },
        { id: 'Zephyr', name: 'Zephyr' },
    ];

    const setupSpeechRecognition = () => {
        // FIX: Cast window to `any` to access non-standard SpeechRecognition properties, resolving TS2551.
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported by this browser.");
            return;
        }

        const recognition: SpeechRecognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            setInput(transcript);
        };
        recognition.onerror = (event) => console.error('Speech recognition error', event.error);
        recognition.onend = () => setIsRecording(false);
        recognitionRef.current = recognition;
    };

    useEffect(() => {
        chatRef.current = geminiService.createChat();
        setMessages([{ role: 'model', content: "Hello! I'm the SiriusAI chat agent. How can I help you today?" }]);
        setupSpeechRecognition();
        
        return () => {
            recognitionRef.current?.abort();
            audioSourceRef.current?.stop();
            audioContextRef.current?.close();
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const playAudio = async (base64Audio: string) => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const audioContext = audioContextRef.current;
        const decoded = decode(base64Audio);
        const audioBuffer = await decodeAudioData(decoded, audioContext);

        audioSourceRef.current = audioContext.createBufferSource();
        audioSourceRef.current.buffer = audioBuffer;
        audioSourceRef.current.connect(audioContext.destination);

        return new Promise<void>(resolve => {
            audioSourceRef.current!.onended = () => resolve();
            audioSourceRef.current!.start();
        });
    };
    
    const handleSend = async () => {
        if (!input.trim() || !chatRef.current) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatRef.current.sendMessage({ message: userMessage.content });
            const modelMessage: ChatMessage = { role: 'model', content: result.text };
            setMessages(prev => [...prev, modelMessage]);

            if (isVoiceMode) {
                setIsSpeaking(true);
                try {
                    const audioB64 = await geminiService.generateSpeech(modelMessage.content, selectedVoice);
                    await playAudio(audioB64);
                } catch (ttsError) {
                    console.error("TTS Error:", ttsError);
                } finally {
                    setIsSpeaking(false);
                }
            }

        } catch (e) {
            const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleMicClick = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setIsRecording(true);
            recognitionRef.current.start();
        }
    };
    
    const handleToggleVoiceMode = (enabled: boolean) => {
        setIsVoiceMode(enabled);
        if (!enabled) {
            if (isRecording) recognitionRef.current?.stop();
            if (isSpeaking) audioSourceRef.current?.stop();
        }
    }

    return (
        <div className="h-full flex flex-col space-y-4">
            <h1 className="text-4xl font-bold text-white">SiriusAI(TM) Chat Agent</h1>
            <Card 
                title="Conversation" 
                icon={<ChatIcon />} 
                className="flex-1 flex flex-col"
                headerActions={
                    <div className="flex items-center space-x-4">
                        <div className={`transition-opacity duration-300 ${isVoiceMode ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <label htmlFor="voice-select" className="text-sm font-medium text-gray-400 mr-2">Voice:</label>
                            <select 
                                id="voice-select"
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value as TTSVoice)}
                                disabled={!isVoiceMode}
                                className="bg-gray-700 border border-gray-600 text-white rounded-md p-1 text-sm focus:ring-cyan-500 focus:border-cyan-500 disabled:cursor-not-allowed"
                            >
                                {ttsVoices.map(voice => (
                                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                                ))}
                            </select>
                        </div>
                        <ToggleSwitch label="Voice Mode" enabled={isVoiceMode} onChange={handleToggleVoiceMode} />
                    </div>
                }
            >
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center"><SiriusIcon /></div>}
                            <div className={`p-3 rounded-xl max-w-lg shadow-md ${msg.role === 'model' ? 'bg-gray-700' : 'bg-cyan-600 text-white'}`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                             {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"><UserIcon /></div>}
                        </div>
                    ))}
                    {isLoading && !isSpeaking && (
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center"><SiriusIcon /></div>
                            <div className="p-3 rounded-lg bg-gray-700">
                                <Spinner />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="border-t border-gray-700 p-4 flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && !isSpeaking && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        disabled={isLoading || isSpeaking}
                    />
                     <button
                        onClick={handleMicClick}
                        disabled={!isVoiceMode || isLoading || isSpeaking}
                        className={`p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-600 hover:bg-gray-500 text-white'
                        }`}
                        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    >
                        <MicIcon className="w-5 h-5" />
                    </button>
                    <Button onClick={handleSend} disabled={isLoading || isSpeaking || !input.trim()}>Send</Button>
                </div>
            </Card>
        </div>
    );
};
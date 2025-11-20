
import React, { useState, useRef, useEffect, useCallback } from 'react';
// FIX: Removed non-existent `LiveSession` type from import.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { MicIcon } from './shared/Icons';
import type { TTSVoice } from '../types';

// Audio decoding/encoding helpers
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

type ConversationState = 'IDLE' | 'CONNECTING' | 'LISTENING' | 'SPEAKING' | 'ERROR';

export const LiveAssistant: React.FC = () => {
    const [conversationState, setConversationState] = useState<ConversationState>('IDLE');
    const [selectedVoice, setSelectedVoice] = useState<TTSVoice>('Zephyr');
    const [transcription, setTranscription] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // FIX: Replaced `LiveSession` with `any` as the specific type is not exported from the SDK.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    
    const ttsVoices: { id: TTSVoice, name: string }[] = [
        { id: 'Zephyr', name: 'Zephyr' },
        { id: 'Puck', name: 'Puck' },
        { id: 'Kore', name: 'Kore' },
        { id: 'Charon', name: 'Charon' },
        { id: 'Fenrir', name: 'Fenrir' },
    ];

    const cleanup = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;

        scriptProcessorRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();
        
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;

        sourcesRef.current.forEach(source => source.stop());
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        setConversationState('IDLE');
    }, []);
    
    useEffect(() => {
      // Ensure cleanup runs when the component unmounts
      return cleanup;
    }, [cleanup]);

    const startConversation = async () => {
        if (conversationState !== 'IDLE') return;

        setConversationState('CONNECTING');
        setError(null);
        setTranscription([]);

        try {
            if (!process.env.API_KEY) throw new Error("API Key not found.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setConversationState('LISTENING');
                        const inputAudioContext = inputAudioContextRef.current;
                        if (!inputAudioContext || !mediaStreamRef.current) return;
                        
                        mediaStreamSourceRef.current = inputAudioContext.createMediaStreamSource(mediaStreamRef.current);
                        scriptProcessorRef.current = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const audioDataB64 = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (audioDataB64 && outputAudioContextRef.current) {
                            setConversationState('SPEAKING');
                            const outputAudioContext = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(audioDataB64), outputAudioContext, 24000, 1);
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContext.destination);
                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                                if (sourcesRef.current.size === 0) {
                                    setConversationState('LISTENING');
                                }
                            });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                        if (message.serverContent?.inputTranscription) {
                            setTranscription(prev => [...prev.slice(0, -1), `You: ${message.serverContent.inputTranscription.text}`]);
                        }
                         if (message.serverContent?.outputTranscription) {
                            setTranscription(prev => [...prev.slice(0, -1), `SiriusAI: ${message.serverContent.outputTranscription.text}`]);
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscription(prev => [...prev, '']);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        setError(`An error occurred: ${e.message}`);
                        cleanup();
                    },
                    onclose: (e: CloseEvent) => {
                        cleanup();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } }
                    }
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to start conversation.");
            cleanup();
        }
    };

    const getStateText = () => {
      switch(conversationState) {
        case 'IDLE': return 'Ready to start';
        case 'CONNECTING': return 'Connecting...';
        case 'LISTENING': return 'Listening...';
        case 'SPEAKING': return 'Speaking...';
        case 'ERROR': return 'Error';
        default: return '...';
      }
    }

    return (
        <div className="h-full flex flex-col space-y-4">
            <h1 className="text-4xl font-bold text-white">SiriusAI(TM) Live Assistant</h1>
            <Card title="Real-time Conversation" icon={<MicIcon />} className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <p className="text-lg text-gray-400">Status: <span className="font-semibold text-cyan-300">{getStateText()}</span></p>

                    {(conversationState === 'IDLE' || conversationState === 'ERROR') && (
                        <div className="flex items-center justify-center space-x-2 my-4">
                            <label htmlFor="live-voice-select" className="text-sm font-medium text-gray-400">Assistant Voice:</label>
                            <select
                                id="live-voice-select"
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value as TTSVoice)}
                                className="bg-gray-700 border border-gray-600 text-white rounded-md p-1 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                            >
                                {ttsVoices.map(voice => (
                                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gray-800 border-4 border-gray-700">
                      <MicIcon className={`w-16 h-16 ${conversationState === 'LISTENING' || conversationState === 'SPEAKING' ? 'text-cyan-400 animate-pulse' : 'text-gray-500'}`} />
                    </div>

                    {conversationState === 'IDLE' || conversationState === 'ERROR' ? (
                      <Button onClick={startConversation}>Start Conversation</Button>
                    ) : (
                      <Button onClick={cleanup} className="bg-red-600 hover:bg-red-500">Stop Conversation</Button>
                    )}

                    {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                </div>
                 <div className="w-full max-w-2xl mt-8 p-4 bg-gray-900/50 border border-gray-700 rounded-lg h-48 overflow-y-auto text-left font-mono">
                    {transcription.map((line, i) => <p key={i} className={`transition-opacity duration-500 ${line.startsWith('You:') ? 'text-cyan-300' : 'text-gray-200'}`}>{line}</p>)}
                </div>
            </Card>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Spinner } from './shared/Spinner';
import { SearchIcon } from './shared/Icons';
import * as geminiService from '../services/geminiService';
import type { GroundingService, GroundingChunk } from '../types';

export const WebExplorer: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('Who won the most bronze medals in the Paris 2024 Olympics?');
    const [service, setService] =useState<GroundingService>('googleSearch');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string | null>(null);
    const [chunks, setChunks] = useState<GroundingChunk[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<GeolocationPosition | null>(null);

    useEffect(() => {
        if (service === 'googleMaps') {
            setPrompt('What are some good Italian restaurants nearby?');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => setLocation(position),
                    (err) => setError(`Geolocation error: ${err.message}`)
                );
            } else {
                setError("Geolocation is not supported by this browser.");
            }
        } else {
            setPrompt('Who won the most bronze medals in the Paris 2024 Olympics?');
            setError(null);
            setLocation(null);
        }
    }, [service]);

    const handleSearch = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        setChunks([]);

        try {
            const response = await geminiService.performGroundedSearch(prompt, service, location);
            setResult(response.text);
            setChunks(response.chunks);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">SiriusAI(TM) Web Explorer</h1>
            <Card title="Grounded Search" icon={<SearchIcon />}>
                <div className="p-4 space-y-4">
                    <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg">
                        <button onClick={() => setService('googleSearch')} className={`flex-1 p-2 rounded-md font-semibold transition ${service === 'googleSearch' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}>Google Search</button>
                        <button onClick={() => setService('googleMaps')} className={`flex-1 p-2 rounded-md font-semibold transition ${service === 'googleMaps' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}>Google Maps</button>
                    </div>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your query..."
                        className="w-full h-24 bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <Button onClick={handleSearch} disabled={isLoading || !prompt} className="w-full">
                        {isLoading ? <Spinner /> : `Search with ${service === 'googleMaps' ? 'Maps' : 'Google'}`}
                    </Button>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                {(result || chunks.length > 0) && (
                    <div className="border-t border-gray-700 p-4 space-y-4">
                        {result && <pre className="text-gray-300 whitespace-pre-wrap font-sans">{result}</pre>}
                        {chunks.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-white mb-2">Sources:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {chunks.map((chunk, index) => {
                                        const source = chunk.web || chunk.maps;
                                        return source ? (
                                            <li key={index}>
                                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{source.title}</a>
                                            </li>
                                        ) : null;
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};
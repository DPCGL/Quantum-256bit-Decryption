
import React, { useState } from 'react';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Spinner } from './shared/Spinner';
import { BrainIcon } from './shared/Icons';
import * as geminiService from '../services/geminiService';

const defaultPrompt = `Write Python code for a web application that visualizes real-time stock market data.
The application should:
1.  Use Flask for the backend.
2.  Fetch data from a public API (e.g., Alpha Vantage).
3.  Use websockets to push data to the frontend.
4.  Use a JavaScript charting library (e.g., Chart.js) to display the data.
Please provide the full code for the backend, frontend HTML, and JavaScript.`;


export const TaskSolver: React.FC = () => {
    const [prompt, setPrompt] = useState<string>(defaultPrompt);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSolve = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await geminiService.solveComplexTask(prompt);
            setResult(response);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">SiriusAI(TM) Task Solver</h1>
            <Card title="SiriusAI™ Logic Core (Thinking Mode)" icon={<BrainIcon />}>
                <div className="p-4 space-y-4">
                    <p className="text-gray-400">Leverage the Logic Core with its maximum thinking budget (32,768 tokens) to handle your most complex queries, from advanced reasoning to large-scale code generation.</p>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a complex prompt..."
                        className="w-full h-64 bg-gray-700 border border-gray-600 rounded-md p-2 text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <Button onClick={handleSolve} disabled={isLoading || !prompt} className="w-full">
                        {isLoading ? <><Spinner /> <span className="ml-2">Thinking...</span></> : 'Solve Task'}
                    </Button>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                {result && (
                    <div className="border-t border-gray-700 p-4">
                        <h3 className="font-semibold text-white mb-2">Result:</h3>
                        <pre className="bg-gray-800 p-4 rounded-md text-gray-300 whitespace-pre-wrap font-mono text-sm overflow-x-auto">
                            <code>{result}</code>
                        </pre>
                    </div>
                )}
            </Card>
        </div>
    );
};

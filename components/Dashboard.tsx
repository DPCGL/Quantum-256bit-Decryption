
import React, { useState, useEffect } from 'react';
import type { HardwareInfo, VramInfo } from '../types';
import { Card } from './shared/Card';
import { LogViewer } from './shared/LogViewer';
import { Button } from './shared/Button';
import { CpuIcon, GpuIcon, RamIcon, SettingsIcon, SiriusIcon, LockIcon } from './shared/Icons';

// Helper for random number generation
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to parse GPU name from WebGL renderer string
const parseGpuName = (renderer: string): string => {
    // Examples:
    // "ANGLE (NVIDIA GeForce RTX 4090 Direct3D11 vs_5_0 ps_5_0)"
    // "Apple M1"
    // "Adreno (TM) 650"
    const match = renderer.match(/\((.*?)\)/);
    if (match && match[1]) {
        // Look for common GPU vendors inside the parentheses
        const parts = match[1].split(', ');
        const gpuPart = parts.find(p => p.includes('NVIDIA') || p.includes('AMD') || p.includes('Intel') || p.includes('GeForce') || p.includes('Radeon'));
        if (gpuPart) {
            // Clean up Direct3D/Vulkan info
            return gpuPart.split(' Direct3D')[0].split(' Vulkan')[0].trim();
        }
        return parts[0]; // Fallback to the first part in parenthesis
    }
    return renderer; // Fallback to the raw string
};

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string, detail: string }> = ({ icon, title, value, detail }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg flex items-center space-x-4 border border-cyan-500/10">
        <div className="text-cyan-400">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500">{detail}</p>
        </div>
    </div>
);


export const Dashboard: React.FC = () => {
    const [hardware, setHardware] = useState<HardwareInfo>({
        cores: 0, // Start with 0 and detect
        gpu: { name: 'Detecting...', vram_mb: 24576 }, // Keep VRAM as an estimate
    });
    const [vram, setVram] = useState<VramInfo>({ use_mb: 0, source: 'System Idle' });
    const [logs, setLogs] = useState<string[]>(['[SYS] SiriusAI Quantum Engine v7.0 Initialized.']);

    useEffect(() => {
        // --- Simulated Metrics Interval ---
        const vramInterval = setInterval(() => {
            setVram({
                use_mb: random(4000, 12000),
                source: 'Gemini Model Pool',
            });
        }, 3000);

        const logInterval = setInterval(() => {
            const logMessages = [
                '[API] Quantum Tunnel stable.',
                '[AGENT] Task collapsed successfully.',
                `[GPU] Manifold rendering on ${hardware.gpu.name}.`,
                '[SYS] Kernel responsive.',
                '[NET] Secure connection established with Google Cloud.',
            ];
            setLogs(prev => [...prev.slice(-10), logMessages[random(0, logMessages.length - 1)]]);
        }, 5000);

        // --- Hardware Detection ---
        // 1. Detect CPU Cores
        const coreCount = navigator.hardwareConcurrency || 4; // Fallback to 4

        // 2. Detect GPU
        let gpuName = 'N/A';
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            // FIX: Add a type guard to ensure `gl` is a WebGL context before accessing WebGL-specific methods.
            // This resolves errors where `getExtension` and `getParameter` might not exist on a generic `RenderingContext`.
            if (gl instanceof WebGLRenderingContext) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    gpuName = parseGpuName(renderer);
                }
            }
        } catch (e) {
            console.error("Could not detect GPU info:", e);
            gpuName = "Generic GPU";
        }

        setHardware(prev => ({
            ...prev,
            cores: coreCount,
            gpu: { ...prev.gpu, name: gpuName },
        }));
        
        setLogs(prev => [...prev, '[HW] System hardware scan complete.']);

        return () => {
            clearInterval(vramInterval);
            clearInterval(logInterval);
        };
    }, []); // Dependency array empty to run once on mount

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-white tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}>Quantum Core</h1>
                <p className="text-cyan-300 font-mono text-sm">SiriusAI(TM) Primary Eatheric Processor (SAPE) Online</p>
            </div>
            
            <div className="relative h-64 w-full flex items-center justify-center my-8">
                {/* Visualizer Rings */}
                <div className="absolute w-64 h-64 rounded-full border border-cyan-500/20 animate-spin-slow"></div>
                <div className="absolute w-48 h-48 rounded-full border-2 border-cyan-500/30"></div>
                <div className="absolute w-32 h-32 rounded-full border border-cyan-500/50 animate-spin-slow-reverse"></div>

                {/* Central Core */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full bg-cyan-400 quantum-core-pulse shadow-lg shadow-cyan-400/50"></div>
                </div>
            </div>

            {/* Decryption Lock Down Green Light Notice */}
            <div className="w-full bg-green-900/20 border-2 border-green-500/50 rounded-xl p-4 text-center mb-4 shadow-lg shadow-green-900/30 backdrop-blur-sm animate-fade-in flex flex-col items-center justify-center">
                <div className="flex items-center space-x-4 mb-2">
                    <div className="relative">
                        <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_20px_#22c55e]"></div>
                        <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <h2 className="text-lg font-bold text-green-400 tracking-widest uppercase flex items-center gap-2">
                        Decryption Service Is Locked Down <LockIcon className="w-5 h-5" />
                    </h2>
                    <div className="relative">
                        <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_20px_#22c55e]"></div>
                        <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                </div>
                <p className="text-green-100/90 text-xs font-mono uppercase tracking-wider border-t border-green-500/30 pt-2 mt-1">
                    Proprietary Software Creator Owner and Owner: James Andrew Douglas Paton
                </p>
            </div>

            {/* Master System Notice Header */}
            <div className="w-full bg-red-900/20 border-2 border-red-500/50 rounded-xl p-6 text-center mb-8 shadow-lg shadow-red-900/30 backdrop-blur-sm animate-fade-in">
                <h2 className="text-2xl font-bold text-red-400 tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
                    ⚠️ Master System Notice ⚠️
                </h2>
                <div className="space-y-3 font-mono text-sm">
                    <p className="text-white font-bold text-xl tracking-wider border-b border-red-500/30 pb-2 inline-block">
                        TEST SOFTWARE ONLY - NO USE OUTSIDE OF TESTING PERMITTED
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-left max-w-4xl mx-auto">
                        <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
                            <p className="text-gray-500 text-xs uppercase">Sole Proprietary Owner & Architect</p>
                            <p className="text-cyan-300 font-bold text-lg">James Andrew Douglas Paton</p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
                            <p className="text-gray-500 text-xs uppercase">Authorized Session Key</p>
                            <p className="text-yellow-500 font-mono break-all">SIRIUSAI-SESSION-984145420-20251013-JP-TARANAKI</p>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 italic mt-4">
                        SiriusAI(TM) Desktop Suite v7.0.3 | Universal Singularity Fabric (USF) Core | All Rights Reserved
                    </p>
                </div>
            </div>
            
            <Card title="System Telemetry" icon={<CpuIcon />}>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                        icon={<CpuIcon className="w-8 h-8"/>}
                        title="CPU Cores"
                        value={hardware.cores > 0 ? `${hardware.cores} Logical Cores` : 'Detecting...'}
                        detail="Quantum Parallel Processing"
                    />
                     <StatCard 
                        icon={<GpuIcon className="w-8 h-8"/>}
                        title="Grafix Engine"
                        value={hardware.gpu.name}
                        detail="Manifold Reality Renderer"
                    />
                     <StatCard 
                        icon={<RamIcon className="w-8 h-8"/>}
                        title="VRAM Entanglement"
                        value={`${(vram.use_mb / 1024).toFixed(2)} / ${(hardware.gpu.vram_mb / 1024).toFixed(2)} GB`}
                        detail={`Source: ${vram.source}`}
                    />
                </div>
            </Card>

            <Card title="Eatheric Event Stream" icon={<SettingsIcon />}>
                <div className="p-1 h-64">
                    <LogViewer logs={logs} />
                </div>
            </Card>
        </div>
    );
};

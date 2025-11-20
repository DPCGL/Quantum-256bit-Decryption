
import React, { useState, useEffect } from 'react';
import type { HardwareInfo, VramInfo } from '../types';
import { Card } from './shared/Card';
import { LogViewer } from './shared/LogViewer';
import { Button } from './shared/Button';
import { CpuIcon, GpuIcon, RamIcon, SettingsIcon, SiriusIcon } from './shared/Icons';

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
                `[GPU] Manifold rendering on ${gpuName}.`,
                '[SYS] Kernel responsive.',
                '[NET] Secure connection established with Google Cloud.',
            ];
            setLogs(prev => [...prev.slice(-10), logMessages[random(0, logMessages.length - 1)]]);
        }, 5000);

        return () => {
            clearInterval(vramInterval);
            clearInterval(logInterval);
        };
    }, []);

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
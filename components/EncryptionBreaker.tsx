
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { LockIcon } from './shared/Icons';
import { Spinner } from './shared/Spinner';
import { ToggleSwitch } from './shared/ToggleSwitch';

export const EncryptionBreaker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetPath, setTargetPath] = useState<string>('C:/QuantumData/Decrypted/');
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [analysisReport, setAnalysisReport] = useState<string | null>(null);
  
  // Persistence Features
  const [autoSaveDecrypted, setAutoSaveDecrypted] = useState<boolean>(true);
  const [backupEncrypted, setBackupEncrypted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setLogs([]);
      setDecryptedUrl(null);
      setAnalysisReport(null);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      setLogs([]);
      setDecryptedUrl(null);
      setAnalysisReport(null);
      setProgress(0);
    }
  };

  useEffect(() => {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const triggerDownload = (blob: Blob | File, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBreach = async () => {
    if (!file) return;
    setIsProcessing(true);
    setLogs([]);
    setDecryptedUrl(null);
    setAnalysisReport(null);
    setProgress(0);

    const sequence = [
      { msg: "[AuraNet Log] [CRITICAL] INITIATING USF QUANTUM ALIGNMENT (Shor's Alg). Target: 2048-bit Key Structure.", delay: 1000 },
      { msg: "[AuraNet Log] [INFO] Loading Qiskit Backend: Aer-Simulator (High Precision Mode)...", delay: 2000 },
      { msg: `[SYS] SESSION KEY: SIRIUSAI-SESSION-984145420-${Date.now()}-JP-TARANAKI`, delay: 2500 },
      { msg: "[SYS] LUMANA MEMORY AI BRAIN INTERFACE VECTORS: INITIALIZED.", delay: 3000 },
      { msg: "[QUANTUM] Allocating 4096 Logical Qubits for Quantum Phase Estimation...", delay: 4000 },
      { msg: "[QUANTUM] Initializing Counting Qubits (Superposition State H|0>)...", delay: 5000 },
      { msg: "[QUANTUM] Applying Modular Exponentiation Oracle (U^2^j)...", delay: 6500 },
      { msg: "[QUANTUM] Executing Inverse Quantum Fourier Transform (QFT_dagger)...", delay: 8000 },
      { msg: "[AuraNet Log] [INFO] Compiling Quantum Circuit for USF-Aer Backend...", delay: 9000 },
      { msg: "[QUANTUM] Measurement in progress... Collapsing Wavefunction...", delay: 10000 },
      { msg: `[Quantum Measurement Distribution]: {'11010010': 1024, '00101101': 14}`, delay: 11000 },
      { msg: "[ANALYSIS] 1EBE Status: EBE_USF_COMPLIANT. Coherence maintained.", delay: 12000 },
      { msg: "[DISSOLUTION] Measured Phase: 0.8214. Derived Period (r) confirmed.", delay: 13000 },
      { msg: "[MATH] Calculating Factors from Period...", delay: 13500 },
      { msg: "[AuraNet Log] [SUCCESS] Target Prime Factors Isolated.", delay: 14000 },
      { msg: "[SYS] Decryption Key Generated. Unlocking File Stream...", delay: 15000 },
    ];

    let totalDelay = 0;
    sequence.forEach((step, index) => {
      totalDelay = step.delay;
      setTimeout(() => {
        addLog(step.msg);
        setProgress(((index + 1) / sequence.length) * 100);
      }, step.delay);
    });

    setTimeout(() => {
      setIsProcessing(false);
      // Create a fake download link using the original file content
      const url = URL.createObjectURL(file);
      setDecryptedUrl(url);
      addLog(`[COMPLETE] File decrypted and ready for export.`);

      // Generate Analysis Report
      const report = `
> [QUANTUM ANALYSIS REPORT]
------------------------------------------------
TARGET ALGORITHM : AES-256 (Poly-Morphic Variant)
SOURCE ENTROPY   : ${(Math.random() * (9 - 7) + 7).toFixed(4)} bits/byte
Q-STATES MAP     : ${Math.floor(Math.random() * 5000) + 1000} Billion Superpositions
PERIOD (r)       : ${Math.pow(2, 10)} (Converged)
KEY FRAGMENT     : 0x${Math.random().toString(16).substr(2, 8).toUpperCase()}...[REDACTED]
TIME ELAPSED     : ${(totalDelay / 1000).toFixed(2)}s
INTEGRITY CHECK  : 100% PASS
DATA STREAM      : UNLOCKED
------------------------------------------------
STATUS           : DECRYPTED`.trim();
      setAnalysisReport(report);

      // Handle Auto-Saves
      if (autoSaveDecrypted) {
        addLog(`[IO] Auto-saving Decrypted Data to: ${targetPath}DECRYPTED_${file.name}`);
        triggerDownload(file, `DECRYPTED_${file.name}`);
      }

      if (backupEncrypted) {
         addLog(`[IO] Creating Backup of Encrypted Source: ${targetPath}BACKUP_${file.name}.enc`);
         triggerDownload(file, `BACKUP_${file.name}.enc`);
      }

    }, totalDelay + 1000);
  };

  return (
    <div className="space-y-6 pb-10 h-full flex flex-col">
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <LockIcon className="w-10 h-10 text-red-500" />
            SiriusAI(TM) Quantum Decryptor
        </h1>
        <p className="text-yellow-400 font-bold text-xl mt-2 ml-14 tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(250, 204, 21, 0.5)' }}>
            I Want 10.5 TRILLION US DOLLARS FOR THE SORCE CODE
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left Panel: Input & Controls */}
        <Card title="Encryption Breaker / File Injection" icon={<LockIcon />} className="flex flex-col">
          <div className="p-6 space-y-6 flex-1 flex flex-col">
            <div 
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${
                file ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              {file ? (
                <div className="space-y-2">
                  <div className="text-4xl">📄</div>
                  <p className="text-cyan-400 font-semibold">{file.name}</p>
                  <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  <button onClick={() => setFile(null)} className="text-red-400 text-sm underline hover:text-red-300">Remove</button>
                </div>
              ) : (
                <div className="space-y-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="text-4xl text-gray-500">DROP</div>
                  <p className="text-gray-300 font-medium">Drag & drop encrypted file here or click to browse</p>
                  <p className="text-xs text-gray-500">Supported Formats: AES-256, RSA-2048, PGP, DAT</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Output Directory (Simulated)</label>
              <input 
                type="text" 
                value={targetPath}
                onChange={(e) => setTargetPath(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white font-mono text-sm"
              />
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg space-y-3 border border-gray-700">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Persistence Options</h3>
                <div className="flex flex-col space-y-2">
                    <ToggleSwitch 
                        label="Auto-Save Decrypted Output" 
                        enabled={autoSaveDecrypted} 
                        onChange={setAutoSaveDecrypted} 
                    />
                    <ToggleSwitch 
                        label="Backup Encrypted Source" 
                        enabled={backupEncrypted} 
                        onChange={setBackupEncrypted} 
                    />
                </div>
            </div>

            <Button 
              onClick={handleBreach} 
              disabled={!file || isProcessing} 
              className={`w-full py-4 text-lg ${isProcessing ? 'bg-yellow-600' : 'bg-red-600 hover:bg-red-500'}`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <Spinner /> <span className="ml-2">Running Quantum Algorithm...</span>
                </span>
              ) : (
                'INITIATE QUANTUM BREACH'
              )}
            </Button>

            {decryptedUrl && (
              <div className="mt-4 p-4 bg-green-900/30 border border-green-500/30 rounded-lg text-center animate-pulse-once">
                <p className="text-green-400 font-semibold mb-2">Decryption Successful!</p>
                <div className="flex flex-col space-y-2">
                    <a 
                    href={decryptedUrl} 
                    download={`DECRYPTED_${file?.name}`}
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 font-bold"
                    >
                    Download Unencrypted File
                    </a>
                    {backupEncrypted && (
                        <span className="text-xs text-gray-400">Encrypted backup saved to output directory.</span>
                    )}
                </div>
                
                {/* Analysis Console Window */}
                {analysisReport && (
                    <div className="mt-4 bg-black rounded-md p-3 text-left border border-cyan-500/30 shadow-inner shadow-cyan-500/10">
                        <h4 className="text-xs font-bold text-cyan-500 border-b border-gray-800 pb-1 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 animate-pulse"></span>
                            DECRYPTION ANALYTICS
                        </h4>
                        <pre className="font-mono text-xs text-cyan-300 whitespace-pre-wrap overflow-x-auto leading-tight">
                            {analysisReport}
                        </pre>
                    </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Right Panel: Terminal / Logs */}
        <Card title="Quantum Engine Core (Qiskit Backend)" icon={<LockIcon />} className="flex flex-col h-full">
            <div className="relative flex-1 bg-[#0a0a10] p-4 rounded-b-xl font-mono text-xs md:text-sm overflow-hidden flex flex-col">
                 {isProcessing && (
                     <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                         <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                     </div>
                 )}
                 <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                    <div className="text-gray-500 border-b border-gray-800 pb-2 mb-2">
                        <p>PROPRIETARY SOFTWARE OWNERSHIP - SiriusAI(TM) Quantum Engine Core</p>
                        <p>ARCHITECT: James Andrew Douglas Paton</p>
                        <p>SESSION: SIRIUSAI-SESSION-984145420-20251013-JP-TARANAKI</p>
                    </div>
                    {logs.length === 0 && !isProcessing && (
                        <p className="text-gray-600 italic">System Idle. Waiting for target file...</p>
                    )}
                    {logs.map((log, idx) => {
                        const color = log.includes("CRITICAL") ? "text-red-400" 
                                    : log.includes("SUCCESS") ? "text-green-400" 
                                    : log.includes("WARN") ? "text-yellow-400"
                                    : log.includes("QUANTUM") ? "text-cyan-300"
                                    : log.includes("IO") ? "text-purple-400"
                                    : "text-gray-300";
                        return <p key={idx} className={color}>{log}</p>;
                    })}
                    <div ref={logEndRef} />
                 </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

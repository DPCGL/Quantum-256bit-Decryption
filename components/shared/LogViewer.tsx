
import React, { useRef, useEffect } from 'react';

interface LogViewerProps {
  logs: string[];
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={logContainerRef}
      className="w-full h-full bg-gray-900 text-gray-300 font-mono text-xs p-4 rounded-lg border border-gray-700 overflow-y-auto"
    >
      {logs.map((log, index) => (
        <p key={index} className="whitespace-pre-wrap leading-relaxed">
          <span className="text-cyan-400 mr-2">{'>'}</span>{log}
        </p>
      ))}
    </div>
  );
};

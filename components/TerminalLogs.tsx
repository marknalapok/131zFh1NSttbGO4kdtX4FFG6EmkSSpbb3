import React, { useState, useEffect, useRef } from 'react';

const LOG_MESSAGES = [
    "Stress-test on Segment 42",
    "Refractive variance at 0.002%",
    "Photon buffer stabilizing...",
    "Lattice expansion detected",
    "Harmonic resonance optimal",
    "Vector mapping sequence initiated",
    "Core temperature: NOMINAL",
    "Recalibrating projection matrix",
    "Packet loss within acceptable parameters",
    "Buffer overflow prevented in sector 7"
];

const TerminalLogs: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial logs
        setLogs([
            "> Initializing refractive simulation...",
            "> Mapping TRCD nodes to spatial grid...",
            "> Stability confirmed. Prismatic dispersion active."
        ]);

        const interval = setInterval(() => {
            const randomMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
            const suffix = Math.random() > 0.7 ? ` [${Math.floor(Math.random() * 999)}ms]` : '';
            
            setLogs(prev => {
                const newLogs = [...prev, `> ${randomMsg}${suffix}`];
                if (newLogs.length > 15) {
                    return newLogs.slice(newLogs.length - 15);
                }
                return newLogs;
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    return (
        <div className="h-full flex flex-col font-mono overflow-hidden relative">
             <div className="text-[0.65rem] text-cyber-accent uppercase mb-2 tracking-wider border-b border-cyber-accent/20 pb-1">
                AI Technical Analysis
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 relative pr-2">
                {logs.map((log, i) => (
                    <div 
                        key={i} 
                        className={`text-[0.7rem] pl-2 border-l-2 ${
                            i === logs.length - 1 
                            ? 'text-cyber-accent border-cyber-accent' 
                            : 'text-slate-400 border-transparent'
                        }`}
                    >
                        {log}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default TerminalLogs;
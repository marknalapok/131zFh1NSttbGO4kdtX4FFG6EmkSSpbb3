import React, { useState, useEffect, useCallback } from 'react';
import LatticeCanvas from './components/LatticeCanvas';
import TerminalLogs from './components/TerminalLogs';
import VectorGraph from './components/VectorGraph';
import { ColorShiftMode } from './types';

function App() {
    const [colorShift, setColorShift] = useState<ColorShiftMode>(ColorShiftMode.CYAN_MAGENTA);
    const [mutationTrigger, setMutationTrigger] = useState(0);
    const [glitchActive, setGlitchActive] = useState(false);
    
    // UI Metrics State
    const [metrics, setMetrics] = useState({
        integrity: 99.42,
        refraction: 2.417,
        entropy: 0.0034
    });

    // Randomize metrics slightly for liveness
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                integrity: Math.min(100, Math.max(90, prev.integrity + (Math.random() - 0.4) * 0.1)),
                refraction: Math.max(1, prev.refraction + (Math.random() - 0.5) * 0.01),
                entropy: Math.max(0, prev.entropy + (Math.random() - 0.5) * 0.0001)
            }));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const handleMutate = useCallback(() => {
        setMutationTrigger(prev => prev + 1);
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
    }, []);

    const handleShift = useCallback(() => {
        setColorShift(prev => (prev + 1) % 3);
    }, []);

    const handleReset = useCallback(() => {
        setMutationTrigger(0); // This logic is partly handled in Canvas by decay, but we can signal reset if needed
        // For visual feedback mainly
        setColorShift(ColorShiftMode.CYAN_MAGENTA);
    }, []);

    return (
        <div className="relative w-screen h-screen font-mono text-cyber-accent bg-cyber-bg overflow-hidden select-none">
            {/* Background Layers */}
            <div className={`fixed inset-0 bg-cyber-accent z-[100] pointer-events-none transition-opacity duration-100 ${glitchActive ? 'opacity-30' : 'opacity-0'}`} />
            <div className="fixed inset-0 scanline z-[5] pointer-events-none" />
            
            {/* 3D Visualizer */}
            <LatticeCanvas colorShift={colorShift} mutationTrigger={mutationTrigger} />

            {/* UI Layer */}
            <div className="absolute inset-0 z-10 p-5 grid grid-cols-[350px_1fr_350px] grid-rows-[80px_1fr_100px] gap-4 pointer-events-none">
                
                {/* Header */}
                <header className="col-span-3 bg-cyber-glass backdrop-blur-md border border-cyber-border p-4 flex justify-between items-center relative overflow-hidden pointer-events-auto">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-accent" />
                    <div>
                        <h1 className="text-xl font-bold tracking-[4px] m-0 text-white">TRCD-LATTICE-01</h1>
                        <span className="text-[0.6rem] tracking-[2px] text-cyber-accent opacity-80">SYNTHETIX STRUCTURE FORGE // V.4.0.2</span>
                    </div>
                    <div className="flex gap-5 text-[0.6rem] tracking-wider">
                        <div className="bg-cyber-accent/10 border border-cyber-accent px-2 py-1">CORE STATUS: OPTIMAL</div>
                        <div className="bg-cyber-accent/10 border border-cyber-accent px-2 py-1">LATENCY: 12ms</div>
                    </div>
                </header>

                {/* Left Sidebar: Metrics */}
                <aside className="col-start-1 row-start-2 flex flex-col gap-4 pointer-events-auto">
                    {/* Metrics Panel */}
                    <div className="bg-cyber-glass backdrop-blur-md border border-cyber-border p-4 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-accent" />
                        
                        <div className="mb-5">
                            <div className="text-[0.65rem] text-cyber-accent mb-1">STRUCTURAL INTEGRITY</div>
                            <div className="text-2xl text-white font-light">{metrics.integrity.toFixed(2)}%</div>
                            <div className="w-full h-[2px] bg-white/10 mt-2 relative">
                                <div className="absolute h-full bg-cyber-accent shadow-[0_0_10px_#00f2ff]" style={{width: `${metrics.integrity}%`}} />
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="text-[0.65rem] text-cyber-accent mb-1">REFRACTIVE INDEX</div>
                            <div className="text-2xl text-white font-light">{metrics.refraction.toFixed(3)} η</div>
                            <div className="w-full h-[2px] bg-white/10 mt-2 relative">
                                <div className="absolute h-full bg-cyber-accent shadow-[0_0_10px_#00f2ff]" style={{width: '74%'}} />
                            </div>
                        </div>

                        <div>
                            <div className="text-[0.65rem] text-cyber-accent mb-1">LATTICE ENTROPY</div>
                            <div className="text-2xl text-white font-light">{metrics.entropy.toFixed(4)} Δ</div>
                            <div className="w-full h-[2px] bg-white/10 mt-2 relative">
                                <div className="absolute h-full bg-cyber-accent shadow-[0_0_10px_#00f2ff]" style={{width: '12%'}} />
                            </div>
                        </div>
                    </div>

                    {/* Graph Panel */}
                    <div className="bg-cyber-glass backdrop-blur-md border border-cyber-border p-4 relative overflow-hidden flex-grow flex flex-col">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-accent" />
                        <VectorGraph />
                    </div>
                </aside>

                {/* Right Sidebar: Logs */}
                <aside className="col-start-3 row-start-2 flex flex-col pointer-events-auto">
                    <div className="bg-cyber-glass backdrop-blur-md border border-cyber-border p-4 relative overflow-hidden h-full">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-accent" />
                        <TerminalLogs />
                    </div>
                </aside>

                {/* Footer Controls */}
                <footer className="col-span-3 row-start-3 bg-cyber-glass backdrop-blur-md border border-cyber-border p-4 flex items-center justify-between relative overflow-hidden pointer-events-auto">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-accent" />
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={handleMutate}
                            className="bg-transparent border border-cyber-accent text-cyber-accent px-6 py-3 uppercase text-xs tracking-widest hover:bg-cyber-accent hover:text-cyber-bg hover:shadow-[0_0_20px_#00f2ff] transition-all duration-300"
                        >
                            Mutate Topology
                        </button>
                        <button 
                            onClick={handleShift}
                            className="bg-transparent border border-cyber-accent text-cyber-accent px-6 py-3 uppercase text-xs tracking-widest hover:bg-cyber-accent hover:text-cyber-bg hover:shadow-[0_0_20px_#00f2ff] transition-all duration-300"
                        >
                            Shift Spectrum
                        </button>
                        <button 
                            onClick={handleReset}
                            className="bg-transparent border border-cyber-accent text-cyber-accent px-6 py-3 uppercase text-xs tracking-widest hover:bg-cyber-accent hover:text-cyber-bg hover:shadow-[0_0_20px_#00f2ff] transition-all duration-300"
                        >
                            Reset Core
                        </button>
                    </div>

                    <div className="text-right">
                        <div className="text-[0.65rem] text-cyber-accent">RENDER ENGINE</div>
                        <div className="text-sm text-white">QUARTZ-DRIVE 3D</div>
                    </div>
                </footer>

            </div>
        </div>
    );
}

export default App;
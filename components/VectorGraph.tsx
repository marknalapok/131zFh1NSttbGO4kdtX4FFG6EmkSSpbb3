import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface DataPoint {
    name: string;
    value: number;
}

const VectorGraph: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
        // Initialize data
        const initialData = Array.from({ length: 30 }, (_, i) => ({
            name: i.toString(),
            value: 50
        }));
        setData(initialData);

        const interval = setInterval(() => {
            setData(prevData => {
                const newData = [...prevData.slice(1)];
                // Generate a sine wave pattern with some noise
                const time = Date.now() * 0.005;
                const value = Math.sin(time) * 30 + 50 + (Math.random() * 10 - 5);
                
                newData.push({
                    name: Date.now().toString(),
                    value: Math.max(0, Math.min(100, value))
                });
                return newData;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="text-[0.65rem] text-cyber-accent uppercase mb-2 tracking-wider">Vector Analysis</div>
            <div className="flex-grow w-full h-[150px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <YAxis domain={[0, 100]} hide />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#00f2ff" 
                            strokeWidth={2} 
                            dot={false} 
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
                {/* Custom grid overlay for aesthetics */}
                <div className="absolute inset-0 border border-cyber-accent/10 pointer-events-none" 
                     style={{
                         backgroundImage: 'linear-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.1) 1px, transparent 1px)',
                         backgroundSize: '20px 20px'
                     }}
                />
            </div>
        </div>
    );
};

export default VectorGraph;
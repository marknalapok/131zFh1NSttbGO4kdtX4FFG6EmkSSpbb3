import React, { useRef, useEffect } from 'react';
import { Point3D, ColorShiftMode } from '../types';

interface LatticeCanvasProps {
    colorShift: ColorShiftMode;
    mutationTrigger: number; // Increment to trigger mutation
}

const LatticeCanvas: React.FC<LatticeCanvasProps> = ({ colorShift, mutationTrigger }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Engine State stored in refs to avoid re-renders during animation loop
    const pointsRef = useRef<Point3D[]>([]);
    const connectionsRef = useRef<[number, number][]>([]);
    const rotationRef = useRef({ x: 0, y: 0 });
    const targetRotationRef = useRef({ x: 0.5, y: 0.5 });
    const mutationFactorRef = useRef(0);
    const animationFrameRef = useRef<number>(0);

    // Initialize 3D Structure
    useEffect(() => {
        const points: Point3D[] = [];
        const connections: [number, number][] = [];
        const size = 200;
        const steps = 4;

        // Create crystalline lattice
        for (let i = -steps; i <= steps; i++) {
            for (let j = -steps; j <= steps; j++) {
                for (let k = -steps; k <= steps; k++) {
                    // Spherical/Diamond volume cull
                    if (Math.abs(i) + Math.abs(j) + Math.abs(k) <= steps) {
                        points.push({
                            baseX: i * 60,
                            baseY: j * 60,
                            baseZ: k * 60,
                            x: i * 60,
                            y: j * 60,
                            z: k * 60,
                            vx: (Math.random() - 0.5) * 2,
                            vy: (Math.random() - 0.5) * 2,
                            vz: (Math.random() - 0.5) * 2
                        });
                    }
                }
            }
        }

        // Connect neighbors
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const d = Math.hypot(
                    points[i].baseX - points[j].baseX, 
                    points[i].baseY - points[j].baseY, 
                    points[i].baseZ - points[j].baseZ
                );
                if (d < 70) {
                    connections.push([i, j]);
                }
            }
        }

        pointsRef.current = points;
        connectionsRef.current = connections;
    }, []);

    // Handle Mutation Trigger
    useEffect(() => {
        if (mutationTrigger > 0) {
            mutationFactorRef.current = 5;
        }
    }, [mutationTrigger]);

    // Input Handling
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            targetRotationRef.current.y = (e.clientX / window.innerWidth - 0.5) * 4;
            targetRotationRef.current.x = (e.clientY / window.innerHeight - 0.5) * 4;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Main Animation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            const width = canvas.width = window.innerWidth;
            const height = canvas.height = window.innerHeight;

            // Clear
            ctx.fillStyle = '#030405';
            ctx.fillRect(0, 0, width, height);

            // Physics Update
            rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.05;
            rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.05;
            mutationFactorRef.current *= 0.98;

            const time = Date.now() * 0.001;
            const mutation = mutationFactorRef.current;

            // Project Points
            const projectedPoints = pointsRef.current.map(p => {
                // Apply mutation/noise
                p.x = p.baseX + Math.sin(time + p.baseY) * 10 * mutation;
                p.y = p.baseY + Math.cos(time + p.baseX) * 10 * mutation;
                p.z = p.baseZ + Math.sin(time + p.baseZ) * 10 * mutation;

                // 3D Rotation
                let x = p.x;
                let y = p.y;
                let z = p.z;

                // Rotate Y
                const cosY = Math.cos(rotationRef.current.y);
                const sinY = Math.sin(rotationRef.current.y);
                const nx = x * cosY - z * sinY;
                const nz = x * sinY + z * cosY;
                x = nx; z = nz;

                // Rotate X
                const cosX = Math.cos(rotationRef.current.x);
                const sinX = Math.sin(rotationRef.current.x);
                const ny = y * cosX - z * sinX;
                const nz2 = y * sinX + z * cosX;
                y = ny; z = nz2;

                // Perspective Projection
                const perspective = 800;
                const scale = perspective / (perspective + z);
                
                return {
                    x: x * scale + width / 2,
                    y: y * scale + height / 2,
                    scale: scale,
                    z: z
                };
            });

            // Draw Connections
            ctx.globalCompositeOperation = 'lighter';
            
            connectionsRef.current.forEach(([i, j]) => {
                const p1 = projectedPoints[i];
                const p2 = projectedPoints[j];

                if (p1.scale > 0.1 && p2.scale > 0.1) {
                    const opacity = Math.min(1, p1.scale * 0.5);
                    
                    // Chromatic Aberration / Refractive Style
                    let mainColor, secColor;
                    
                    if (colorShift === ColorShiftMode.CYAN_MAGENTA) {
                        mainColor = `rgba(0, 242, 255, ${opacity * 0.5})`; // Cyan
                        secColor = `rgba(255, 0, 85, ${opacity * 0.3})`;   // Magenta
                        
                        ctx.beginPath();
                        ctx.strokeStyle = mainColor;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.strokeStyle = secColor;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x + 2, p1.y);
                        ctx.lineTo(p2.x + 2, p2.y);
                        ctx.stroke();
                    } 
                    else if (colorShift === ColorShiftMode.LIME_TEAL) {
                        mainColor = `rgba(200, 255, 0, ${opacity * 0.5})`;
                        secColor = `rgba(0, 255, 200, ${opacity * 0.3})`;

                        ctx.beginPath();
                        ctx.strokeStyle = mainColor;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.strokeStyle = secColor;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y + 2);
                        ctx.lineTo(p2.x, p2.y + 2);
                        ctx.stroke();
                    } 
                    else {
                        mainColor = `rgba(200, 0, 255, ${opacity * 0.5})`;
                        secColor = `rgba(0, 100, 255, ${opacity * 0.3})`;

                        ctx.beginPath();
                        ctx.strokeStyle = mainColor;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.strokeStyle = secColor;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x - 2, p1.y);
                        ctx.lineTo(p2.x - 2, p2.y);
                        ctx.stroke();
                    }
                }
            });

            // Draw Nodes
            ctx.fillStyle = '#fff';
            projectedPoints.forEach(p => {
                if (p.scale > 0) {
                    const size = 2 * p.scale;
                    ctx.globalAlpha = p.scale * 0.8;
                    ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
                }
            });

            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [colorShift]);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed top-0 left-0 z-[1] w-full h-full pointer-events-none"
        />
    );
};

export default LatticeCanvas;
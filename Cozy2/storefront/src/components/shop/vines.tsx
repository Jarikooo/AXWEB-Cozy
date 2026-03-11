"use client";

import React, { useEffect, useState } from "react";

const RightLeaf = ({ x, y, color, scale = 1, rotation = 0 }: { x: number, y: number, color: string, scale?: number, rotation?: number }) => (
    <path
        d="M 0 0 C 10 -8 25 0 30 20 C 15 25 5 10 0 0 Z"
        fill={color}
        transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}
        className="opacity-90 drop-shadow-sm"
    />
);

const LeftLeaf = ({ x, y, color, scale = 1, rotation = 0 }: { x: number, y: number, color: string, scale?: number, rotation?: number }) => (
    <path
        d="M 0 0 C -10 -8 -25 0 -30 20 C -15 25 -5 10 0 0 Z"
        fill={color}
        transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}
        className="opacity-90 drop-shadow-sm"
    />
);

export function DecorativeVines() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <svg width="0" height="0" className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <defs>
                    <filter id="vine-texture">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.15 0" />
                        <feComposite in2="SourceGraphic" operator="in" />
                        <feBlend in="SourceGraphic" mode="multiply" />
                    </filter>

                    <pattern id="vine-pattern-left" x="0" y="0" width="160" height="400" patternUnits="userSpaceOnUse">
                        <g transform="translate(40, 0)">
                            <path d="M 30 0 C 10 133 50 267 30 400" fill="none" stroke="#3A5A43" strokeWidth="1.5" className="opacity-80 drop-shadow-sm" />
                            <RightLeaf x={20} y={40} color="#3A5A43" scale={0.8} rotation={15} />
                            <LeftLeaf x={15} y={100} color="#3A5A43" scale={0.9} rotation={-10} />
                            <RightLeaf x={25} y={170} color="#3A5A43" scale={0.7} rotation={25} />
                            <LeftLeaf x={40} y={230} color="#3A5A43" scale={0.85} rotation={-5} />
                            <RightLeaf x={45} y={300} color="#3A5A43" scale={1} rotation={10} />
                            <LeftLeaf x={35} y={360} color="#3A5A43" scale={0.75} rotation={-15} />

                            <path d="M 50 0 C 40 133 60 267 50 400" fill="none" stroke="#6B8E76" strokeWidth="2.5" className="opacity-90 drop-shadow-sm" />
                            <LeftLeaf x={45} y={30} color="#6B8E76" scale={0.9} rotation={-20} />
                            <RightLeaf x={48} y={90} color="#6B8E76" scale={1.1} rotation={5} />
                            <LeftLeaf x={55} y={160} color="#6B8E76" scale={0.8} rotation={-10} />
                            <RightLeaf x={58} y={220} color="#6B8E76" scale={0.95} rotation={15} />
                            <LeftLeaf x={52} y={280} color="#6B8E76" scale={0.85} rotation={-25} />
                            <RightLeaf x={50} y={350} color="#6B8E76" scale={1} rotation={5} />

                            <path d="M 20 0 C 40 133 0 267 20 400" fill="none" stroke="#4A6B53" strokeWidth="2" className="drop-shadow-sm" />
                            <LeftLeaf x={25} y={50} color="#4A6B53" scale={1.2} rotation={-15} />
                            <RightLeaf x={35} y={120} color="#4A6B53" scale={1.0} rotation={20} />
                            <LeftLeaf x={30} y={180} color="#4A6B53" scale={1.3} rotation={0} />
                            <RightLeaf x={10} y={240} color="#4A6B53" scale={0.9} rotation={10} />
                            <LeftLeaf x={5} y={310} color="#4A6B53" scale={1.1} rotation={-20} />
                            <RightLeaf x={15} y={370} color="#4A6B53" scale={1.2} rotation={15} />
                        </g>
                    </pattern>
                </defs>
            </svg>

            <div className="absolute inset-0 z-0 pointer-events-none opacity-90 overflow-hidden mix-blend-multiply flex justify-between">
                <div className="w-24 md:w-32 lg:w-40 h-full">
                    <svg className="w-full h-full">
                        <rect width="100%" height="100%" fill="url(#vine-pattern-left)" filter="url(#vine-texture)" />
                    </svg>
                </div>

                <div className="w-24 md:w-32 lg:w-40 h-full" style={{ transform: "scaleX(-1)" }}>
                    <svg className="w-full h-full">
                        <rect width="100%" height="100%" fill="url(#vine-pattern-left)" filter="url(#vine-texture)" />
                    </svg>
                </div>
            </div>
        </>
    );
}

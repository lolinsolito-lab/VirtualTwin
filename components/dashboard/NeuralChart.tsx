"use client";

import React from 'react';

interface NeuralChartProps {
    type: 'bar' | 'area';
    data: { name: string; value: number }[];
    height?: number;
}

export function NeuralChart({ type, data, height = 200 }: NeuralChartProps) {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const width = 1000;
    const padding = 40;

    if (type === 'bar') {
        const barWidth = (width - padding * 2) / data.length;
        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                {data.map((d, i) => {
                    const barHeight = (d.value / maxVal) * (height - padding);
                    const x = padding + i * barWidth;
                    const y = height - barHeight - padding;
                    return (
                        <g key={i} className="group">
                            <rect
                                x={x + 10}
                                y={y}
                                width={barWidth - 20}
                                height={barHeight}
                                fill="url(#barGrad)"
                                rx="8"
                                className="transition-all duration-1000 origin-bottom hover:brightness-125 cursor-pointer"
                            />
                            <text
                                x={x + barWidth / 2}
                                y={height - 10}
                                textAnchor="middle"
                                className="text-[12px] fill-charcoal/40 font-serif italic uppercase tracking-widest"
                            >
                                {d.name}
                            </text>
                            <text
                                x={x + barWidth / 2}
                                y={y - 10}
                                textAnchor="middle"
                                className="text-[14px] fill-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                {d.value}
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    }

    if (type === 'area') {
        const step = (width - padding * 2) / (data.length - 1);
        const points = data.map((d, i) => {
            const x = padding + i * step;
            const y = height - (d.value / maxVal) * (height - padding * 2) - padding;
            return `${x},${y}`;
        }).join(' ');

        const areaPoints = `${points} ${width - padding},${height - padding} ${padding},${height - padding}`;

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polyline
                    fill="url(#areaGrad)"
                    points={areaPoints}
                />
                <polyline
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    className="animate-pulse"
                />
                {data.map((d, i) => {
                    const x = padding + i * step;
                    const y = height - (d.value / maxVal) * (height - padding * 2) - padding;
                    return (
                        <g key={i} className="group">
                            <circle cx={x} cy={y} r="6" fill="#D4AF37" className="group-hover:r-8 transition-all shadow-luxury" />
                            <text
                                x={x}
                                y={height - 10}
                                textAnchor="middle"
                                className="text-[12px] fill-charcoal/40 font-serif italic uppercase tracking-widest"
                            >
                                {d.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    }

    return null;
}


import React from 'react';

interface IconProps {
    name: string;
    className?: string;
    strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = "w-6 h-6", strokeWidth = 1 }) => {
    const gold = "#D4AF37";

    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke={gold} strokeWidth={strokeWidth}>
            {name === 'globe' && (
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            )}
            {name === 'cpu' && (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            )}
            {/* Default placeholder path if name doesn't match */}
            {!['globe', 'cpu'].includes(name) && (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            )}
        </svg>
    );
};

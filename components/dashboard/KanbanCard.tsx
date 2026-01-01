
"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface KanbanCardProps {
    id: string;
    lead: {
        id: string;
        name: string;
        business: string;
        value: number;
        created_at: string;
    };
}

export function KanbanCard({ id, lead }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
    };

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins}m fa`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h fa`;
        return `${Math.floor(diffHours / 24)}g fa`;
    };

    return (

        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="silk-card p-10 rounded-[3rem] border border-white/60 hover:border-gold/30 transition-all duration-700 group cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.02] group-hover:bg-gold/[0.05] transition-colors duration-700 blur-2xl" />
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center font-serif text-white text-xl shadow-luxury border border-white/50">
                        {lead.name?.[0] || 'L'}
                    </div>
                    <Link
                        href={`/dashboard/chat?leadId=${lead.id}`}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="p-3 bg-white/40 hover:bg-gold hover:text-white rounded-full transition-all duration-500 text-gold shadow-sm"
                        title="Apri Chat Live"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </Link>
                </div>
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    className="text-charcoal/10 hover:text-gold transition-colors duration-500"
                >
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </div>
            <h4 className="text-charcoal text-base font-medium tracking-tight mb-2">{lead.name}</h4>
            <p className="text-charcoal/30 text-[9px] uppercase tracking-[0.3em] mb-8 font-black">{lead.business}</p>

            <div className="flex justify-between items-center pt-8 border-t border-charcoal/5">
                <span className="text-gold font-serif italic text-2xl tracking-tight">€{lead.value?.toLocaleString() || '0'}</span>
                <span className="text-[9px] text-charcoal/20 uppercase tracking-tighter font-bold">{timeAgo(lead.created_at)}</span>
            </div>
        </div>
    );
}

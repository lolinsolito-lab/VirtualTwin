
"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
    id: string;
    name: string;
    color: string;
    leads: any[];
}

export function KanbanColumn({ id, name, color, leads }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col gap-6 md:gap-12 w-[280px] sm:w-[340px] flex-shrink-0">
            <div className="flex justify-between items-center px-4 md:px-6">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full ${color} shadow-[0_0_15px_currentColor] opacity-80`} />
                    <h3 className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black text-charcoal/40 italic">{name}</h3>
                </div>
                <span className="text-[9px] md:text-[10px] font-black text-charcoal/20 bg-charcoal/5 px-3 md:px-4 py-1 md:py-1.5 rounded-full">
                    {leads.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className="space-y-6 md:space-y-10 flex-1 min-h-[400px] md:min-h-[600px] perspective-3d"
            >
                <SortableContext
                    items={leads.map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {leads.map((lead) => (
                        <KanbanCard key={lead.id} id={lead.id} lead={lead} />
                    ))}
                </SortableContext>

                <button className="w-full py-4 md:py-6 border border-dashed border-charcoal/10 rounded-[1.5rem] md:rounded-[2.5rem] text-charcoal/20 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black hover:border-gold/30 hover:text-gold transition-all duration-700 hover:bg-white/50">
                    + NUOVO LEAD
                </button>
            </div>
        </div>
    );
}

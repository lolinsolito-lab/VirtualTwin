
"use client";

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { supabase } from '@/lib/supabase';

interface KanbanBoardProps {
    initialStages: any[];
    initialLeads: any[];
}

export function KanbanBoard({ initialStages, initialLeads }: KanbanBoardProps) {
    const [leads, setLeads] = useState(initialLeads);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeLeadId = active.id as string;
        const overId = over.id as string;

        const activeLead = leads.find(l => l.id === activeLeadId);
        if (!activeLead) return;

        // Check if dragging over a column or another card
        const isOverAColumn = initialStages.some(s => s.id === overId);

        if (isOverAColumn) {
            if (activeLead.stage !== overId) {
                setLeads(prev => prev.map(l =>
                    l.id === activeLeadId ? { ...l, stage: overId } : l
                ));
            }
        } else {
            const overLead = leads.find(l => l.id === overId);
            if (overLead && activeLead.stage !== overLead.stage) {
                setLeads(prev => prev.map(l =>
                    l.id === activeLeadId ? { ...l, stage: overLead.stage } : l
                ));
            }
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeLeadId = active.id as string;
        const finalLead = leads.find(l => l.id === activeLeadId);

        if (finalLead) {
            // Map stage back to conversation status
            const statusMap: Record<string, string> = {
                'inquiry': 'active',
                'qualification': 'qualified',
                'negotiation': 'converted',
                'closed': 'closed'
            };
            const newStatus = statusMap[finalLead.stage] || 'active';

            // Update Supabase in background
            await supabase
                .from('conversations')
                .update({ status: newStatus })
                .eq('id', activeLeadId);
        }
    };

    const selectedLead = activeId ? leads.find(l => l.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-10 overflow-x-auto pb-10 scrollbar-hide">
                {initialStages.map((stage) => (
                    <KanbanColumn
                        key={stage.id}
                        id={stage.id}
                        name={stage.name}
                        color={stage.color || 'bg-gold'}
                        leads={leads.filter(l => l.stage === stage.id)}
                    />
                ))}
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.5',
                        },
                    },
                }),
            }}>
                {activeId && selectedLead ? (
                    <KanbanCard id={activeId} lead={selectedLead} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

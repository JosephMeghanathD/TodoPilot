// src/components/SubTaskItem.tsx

import React, { useState } from 'react';
import type { SubTaskDto } from "../api/types";
import { CheckSquare, Square, Trash2, ChevronDown } from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import clsx from 'clsx';

interface SubTaskItemProps {
    subtask: SubTaskDto;
}

const SubTaskItem = ({ subtask }: SubTaskItemProps) => {
    const { toggleSubTaskCompletion, deleteSubTask } = useTaskStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const CompletionIcon = subtask.completed ? CheckSquare : Square;
    const hasDescription = subtask.description && subtask.description.trim() !== '';

    const handleToggleComplete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await toggleSubTaskCompletion(subtask.taskId, subtask.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteSubTask(subtask.taskId, subtask.id);
    };

    const handleToggleExpansion = () => {
        if (hasDescription) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        // --- THIS 'group' DIV IS THE FIX ---
        <div className="group rounded-md hover:bg-border/40">
            {/* Main visible row */}
            <div 
                className={clsx("flex items-center p-2", { "cursor-pointer": hasDescription })}
                onClick={handleToggleExpansion}
            >
                <button onClick={handleToggleComplete} className="mr-3 text-muted-foreground hover:text-primary">
                    <CompletionIcon size={18} />
                </button>
                <span 
                  className={clsx('text-sm flex-grow', {
                    'line-through text-muted-foreground': subtask.completed,
                    'text-foreground': !subtask.completed,
                  })}
                >
                    {subtask.title}
                </span>
                
                <div className="flex items-center ml-2">
                    {hasDescription && (
                        <ChevronDown 
                            size={16} 
                            className={clsx('text-muted-foreground transition-transform duration-200', { 'rotate-180': isExpanded })} 
                        />
                    )}
                    <button 
                        onClick={handleDelete}
                        className="ml-1 p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-900/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        title={`Delete sub-task "${subtask.title}"`}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Collapsible description section */}
            {hasDescription && (
                <div className={clsx('grid transition-[grid-template-rows] duration-300 ease-in-out', {
                    'grid-rows-[1fr]': isExpanded,
                    'grid-rows-[0fr]': !isExpanded,
                })}>
                    <div className="overflow-hidden">
                        <p className='px-4 pb-3 pl-10 text-sm text-muted-foreground'>
                            {subtask.description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubTaskItem;
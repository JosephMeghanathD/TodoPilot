// src/components/SubTaskList.tsx

import { useState } from 'react';
import type { SubTaskDto } from "../api/types";
import SubTaskItem from "./SubTaskItem";
import AddSubTaskForm from "./AddSubTaskForm";
import { Plus } from 'lucide-react';

interface SubTaskListProps {
    subtasks: SubTaskDto[];
    taskId: number; // Prop to know which parent task this list belongs to
}

const SubTaskList = ({ subtasks, taskId }: SubTaskListProps) => {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div className="pl-6 pr-2 py-2 space-y-1">
            {subtasks.map(subtask => (
                <SubTaskItem key={subtask.id} subtask={subtask} />
            ))}
            
            {isAdding ? (
                <AddSubTaskForm taskId={taskId} onComplete={() => setIsAdding(false)} />
            ) : (
                <button 
                    onClick={() => setIsAdding(true)} 
                    className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-2 rounded-md hover:bg-muted/20"
                >
                    <Plus size={14} className="mr-2" /> Add sub-task
                </button>
            )}
        </div>
    );
};

export default SubTaskList;
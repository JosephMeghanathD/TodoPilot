// src/components/TaskList.tsx

import { useState } from 'react';
import { useTaskStore } from "../store/taskStore";
import { Plus, ChevronDown } from 'lucide-react';
import TaskItem from "./TaskItem";
import AddTaskModal from './AddTaskModal';
import clsx from 'clsx';

const TaskList = () => {
    const { tasks, categories, selectedCategoryId } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [completedExpanded, setcompletedExpanded] = useState(false);

    // 1. Filter tasks by the selected category first
    const filteredTasks = selectedCategoryId
        ? tasks.filter(task => task.category?.id === selectedCategoryId)
        : tasks;

    // 2. Define the priority order for sorting
    const priorityOrder: { [key: string]: number } = {
        HIGH: 4,
        MEDIUM: 3,
        LOW: 2,
        NONE: 1,
    };

    // 3. Separate into pending and completed, and sort them
    const pendingTasks = filteredTasks
        .filter(task => !task.completed)
        .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    const completedTasks = filteredTasks
        .filter(task => task.completed)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()); // Most recently completed first

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);

    return (
        <>
            <AddTaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                initialCategoryId={selectedCategoryId}
            />

            <div>
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-foreground">
                        {selectedCategory ? selectedCategory.name : 'All Tasks'}
                    </h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-opacity-80 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </button>
                </div>
                
                {/* --- PENDING TASKS SECTION --- */}
                <div className="space-y-4">
                    {pendingTasks.length > 0 ? (
                        pendingTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                            <p className="text-muted-foreground">No pending tasks in this category.</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">Great job!</p>
                        </div>
                    )}
                </div>

                {/* --- COMPLETED TASKS ACCORDION --- */}
                {completedTasks.length > 0 && (
                    <div className="mt-8">
                        {/* Accordion Header */}
                        <button 
                            onClick={() => setcompletedExpanded(!completedExpanded)}
                            className="w-full flex justify-between items-center p-2 rounded-md hover:bg-muted/30"
                        >
                            <h2 className="font-semibold text-muted-foreground">
                                Completed ({completedTasks.length})
                            </h2>
                            <ChevronDown className={clsx("transition-transform duration-300", { "rotate-180": completedExpanded })} />
                        </button>
                        
                        {/* Accordion Content */}
                        <div className={clsx("grid transition-[grid-template-rows] duration-300 ease-in-out", {
                            "grid-rows-[1fr]": completedExpanded,
                            "grid-rows-[0fr]": !completedExpanded,
                        })}>
                            <div className="overflow-hidden">
                                <div className="pt-4 space-y-4">
                                    {completedTasks.map(task => (
                                        <TaskItem key={task.id} task={task} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default TaskList;
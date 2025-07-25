// src/components/TaskItem.tsx

import React, { useState } from 'react';
import type { TaskDto, AiDecompositionResponse, AiDecompositionRequest } from '../api/types';
import { useTaskStore } from '../store/taskStore';
import SubTaskList from './SubTaskList';
import AiDecompositionModal from './AiDecompositionModal';
import AiSettingsModal from './AiSettingsModal';
import { ChevronDown, CheckSquare, Square, GitCommit, Wand2, Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface TaskItemProps {
  task: TaskDto;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { 
    expandedTaskIds, 
    toggleTaskExpansion, 
    toggleTaskCompletion, 
    decomposeTask, 
    addDecomposedSubtasksToExistingTask, 
    deleteTask 
  } = useTaskStore();

  const isExpanded = expandedTaskIds.has(task.id);
  const CompletionIcon = task.completed ? CheckSquare : Square;

  const [isDecomposing, setIsDecomposing] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiResponseData, setAiResponseData] = useState<AiDecompositionResponse | null>(null);

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleTaskCompletion(task.id);
  };

  const handleDecompose = async (settings: Omit<AiDecompositionRequest, 'task'>) => {
    setIsDecomposing(true);
    const response = await decomposeTask({
      task: task.title,
      context: task.description || '',
      ...settings,
    });
    setIsDecomposing(false);
    setIsSettingsModalOpen(false);

    if (response) {
      setAiResponseData(response);
      setIsAiModalOpen(true);
    } else {
      alert("Could not decompose the task. The AI service may be unavailable.");
    }
  };
  
  const handleConfirmAiSubtasks = async (subtasks: { title: string; description: string }[]) => {
    const success = await addDecomposedSubtasksToExistingTask(task.id, subtasks);
    if (success) {
      setIsAiModalOpen(false);
      if (!isExpanded) {
        toggleTaskExpansion(task.id);
      }
    } else {
      alert("Failed to add sub-tasks.");
    }
  };

  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`)) {
      deleteTask(task.id);
    }
  };

  return (
    <>
      <AiSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSubmit={handleDecompose}
        taskTitle={task.title}
        isDecomposing={isDecomposing}
      />

      {/* --- THIS IS THE FIX --- */}
      {/* The AiDecompositionModal is now conditionally rendered. */}
      {/* It will only be added to the DOM if `aiResponseData` is not null. */}
      {aiResponseData && (
        <AiDecompositionModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onConfirm={handleConfirmAiSubtasks}
          aiResponse={aiResponseData}
        />
      )}

      <div className="border border-border rounded-lg bg-muted/20 overflow-hidden">
        {/* Task Header */}
        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleTaskExpansion(task.id)}>
          <div className="flex items-center flex-1 min-w-0">
            <button onClick={handleToggleComplete} className="mr-4 text-muted-foreground hover:text-primary">
              <CompletionIcon size={20} />
            </button>
            <div className='flex-grow min-w-0'>
              <h3 className={clsx('font-semibold truncate', { 'line-through text-muted-foreground': task.completed, 'text-foreground': !task.completed })}>
                {task.title}
              </h3>
              <p className={clsx('text-sm mt-1 truncate', { 'line-through text-muted-foreground': task.completed, 'text-muted-foreground': !task.completed })}>
                {task.description || 'No description.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pl-4">
            {task.subTasks && task.subTasks.length > 0 && (
              <div className="flex items-center text-xs text-muted-foreground bg-border rounded-full px-2 py-0.5" title={`${task.subTasks.filter(st => st.completed).length} of ${task.subTasks.length} sub-tasks completed`}>
                <GitCommit size={12} className="mr-1.5" />
                <span>{task.subTasks.filter(st => st.completed).length} / {task.subTasks.length}</span>
              </div>
            )}
            
            <button onClick={(e) => { e.stopPropagation(); setIsSettingsModalOpen(true); }} className="p-2 rounded-full hover:bg-muted/30 text-muted-foreground hover:text-primary" title="Decompose with AI">
              <Wand2 size={16}/>
            </button>

            <button onClick={handleDeleteTask} className="p-2 rounded-full hover:bg-red-900/50 text-muted-foreground hover:text-red-500" title="Delete Task">
              <Trash2 size={16}/>
            </button>

            <div className="h-full w-[1px] bg-border mx-2"></div>
            <ChevronDown size={20} className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Collapsible Sub-task Section */}
        <div className={clsx("grid transition-[grid-template-rows] duration-300 ease-in-out", { 'grid-rows-[1fr]': isExpanded, 'grid-rows-[0fr]': !isExpanded })}>
          <div className="overflow-hidden">
            <div className="border-t border-border/70">
              <SubTaskList subtasks={task.subTasks} taskId={task.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskItem;
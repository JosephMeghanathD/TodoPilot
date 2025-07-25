// src/components/AiDecompositionModal.tsx

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, type FormEvent, useEffect } from 'react';
import type { AiDecompositionResponse, AiSubtaskDetail } from '../api/types';
import { Loader2, X, Trash2, Wand2, GripVertical, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable and Expandable Sub-component ---
interface SortableAiSubtaskItemProps {
    id: string;
    subtask: AiSubtaskDetail;
    onDelete: (e: React.MouseEvent) => void;
}

const SortableAiSubtaskItem = ({ id, subtask, onDelete }: SortableAiSubtaskItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
    };
    
    return (
        <div ref={setNodeRef} style={style} className={clsx("rounded-md bg-muted/20", { 'opacity-50 shadow-lg': isDragging })}>
            <div className='flex items-center'>
                <div {...attributes} {...listeners} className="p-3 text-muted-foreground cursor-grab touch-none">
                    <GripVertical size={18} />
                </div>
                <div 
                    className='flex-1 min-w-0 py-2 flex items-center cursor-pointer'
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <p className='font-medium text-foreground truncate'>{subtask.title}</p>
                    <ChevronDown size={16} className={clsx('ml-auto text-muted-foreground transition-transform duration-200', { 'rotate-180': isExpanded })} />
                </div>
                <button onClick={onDelete} className='ml-2 p-2 mr-2 text-muted-foreground hover:text-red-500'>
                    <Trash2 size={16} />
                </button>
            </div>
            <div className={clsx('grid transition-[grid-template-rows] duration-300 ease-in-out', {
                'grid-rows-[1fr]': isExpanded,
                'grid-rows-[0fr]': !isExpanded,
            })}>
                <div className="overflow-hidden">
                    <p className='px-4 pb-3 text-sm text-muted-foreground'>
                        {subtask.description}
                    </p>
                </div>
            </div>
        </div>
    );
};


// --- Main Modal Component (Updated) ---
interface AiDecompositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (subtasks: { title: string; description: string }[]) => void;
  aiResponse: AiDecompositionResponse;
}

export default function AiDecompositionModal({ isOpen, onClose, onConfirm, aiResponse }: AiDecompositionModalProps) {
  const [subtasks, setSubtasks] = useState<AiSubtaskDetail[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- BUG FIX IS HERE ---
  // This effect now ONLY runs when the `aiResponse` prop changes.
  // This populates the list when the modal opens but prevents it from
  // resetting the state every time the component re-renders.
  useEffect(() => {
    if (aiResponse) {
      setSubtasks(aiResponse.subtasks);
    }
  }, [aiResponse]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSubtasks((items) => {
        const oldIndex = items.findIndex((_, i) => i.toString() === active.id);
        const newIndex = items.findIndex((_, i) => i.toString() === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDeleteSubtask = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent event bubbling
    setSubtasks(current => current.filter((_, i) => i !== index));
  };

  const handleAddSubtask = (e: FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks(current => [...current, { title: newSubtaskTitle, description: 'Manually added sub-task.', estimated_time_hours: 0 }]);
    setNewSubtaskTitle('');
  };

  const handleCreateTasks = async () => {
    setIsLoading(true);
    const tasksToCreate = subtasks.map(({ title, description }) => ({ title, description }));
    await onConfirm(tasksToCreate);
    setIsLoading(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-background border border-border p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-foreground flex justify-between items-center">
                  <span className='flex items-center'><Wand2 className='mr-3 text-primary'/> AI Task Breakdown</span>
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-muted/50"><X size={20}/></button>
                </Dialog.Title>
                
                <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Drag to reorder, edit, and confirm the sub-tasks for: <strong className='text-foreground'>{aiResponse.task}</strong></p>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={subtasks.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
                        <div className="mt-4 max-h-60 overflow-y-auto pr-3 space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-foreground/80 hover:scrollbar-thumb-foreground scrollbar-thumb-rounded-full">
                            {subtasks.map((sub, index) => (
                                <SortableAiSubtaskItem 
                                    key={index} 
                                    id={index.toString()}
                                    subtask={sub}
                                    onDelete={(e) => handleDeleteSubtask(e, index)} 
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <form onSubmit={handleAddSubtask} className='mt-4 flex space-x-2'>
                    <input value={newSubtaskTitle} onChange={e => setNewSubtaskTitle(e.target.value)} type="text" placeholder="Add another sub-task..." className="flex-grow rounded-md border-border bg-muted/30 focus:border-primary focus:ring-primary py-2 px-3 text-sm"/>
                    <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted/50">Add</button>
                </form>

                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted/50">
                        Cancel
                    </button>
                    <button type="button" onClick={handleCreateTasks} disabled={isLoading} className={clsx("inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-opacity-90", { "opacity-50 cursor-not-allowed": isLoading })}>
                      {isLoading ? <Loader2 className="animate-spin h-5 w-5"/> : `Create Task & ${subtasks.length} Sub-tasks`}
                    </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
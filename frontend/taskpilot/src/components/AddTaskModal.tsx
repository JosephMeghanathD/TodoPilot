// src/components/AddTaskModal.tsx

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, type FormEvent, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { type Priority, type TaskRequestDto, type AiDecompositionResponse, PriorityOptions } from '../api/types';
import { Loader2, X, Wand2 } from 'lucide-react';
import clsx from 'clsx';
import AiDecompositionModal from './AiDecompositionModal';
import AiSettingsModal from './AiSettingsModal';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategoryId: number | null;
}

export default function AddTaskModal({ isOpen, onClose, initialCategoryId }: AddTaskModalProps) {
  const { categories, createTaskWithSubtasks, decomposeTask } = useTaskStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('NONE');
  const [categoryId, setCategoryId] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDecomposing, setIsDecomposing] = useState(false);
  
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiResponseData, setAiResponseData] = useState<AiDecompositionResponse | null>(null);

  // Effect to reset form state when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setCategoryId(initialCategoryId?.toString() || '');
      // Reset form fields
      setTitle('');
      setDescription('');
      setPriority('NONE');
    }
  }, [isOpen, initialCategoryId]);

  // Step 1: User clicks the wand icon, this function opens the settings modal
  const handleDecomposeClick = () => {
    if (!title.trim()) {
        alert("Please enter a task title before using the AI decompose feature.");
        return;
    }
    setIsSettingsModalOpen(true);
  };

  // Step 2: User submits the settings modal, this function is called
  const handleDecompose = async (settings: any) => {
    setIsDecomposing(true);
    const response = await decomposeTask({
      task: title,
      ...settings
    });
    setIsDecomposing(false);
    setIsSettingsModalOpen(false);
    
    if (response) {
        setAiResponseData(response);
        setIsAiModalOpen(true); // Open the results modal
    } else {
        alert("Could not decompose the task. The AI service may be unavailable.");
    }
  };

  // Step 3: User confirms the AI-generated subtasks, this function is called
  const handleConfirmAiSubtasks = async (subtasks: { title: string; description: string }[]) => {
    setIsLoading(true);
    const taskData: TaskRequestDto = {
        title, 
        description, 
        priority, 
        categoryId: categoryId ? parseInt(categoryId) : null,
    };
    const success = await createTaskWithSubtasks(taskData, subtasks);
    setIsLoading(false);
    if(success) {
        setIsAiModalOpen(false);
        onClose(); // Close the main AddTaskModal as well
    } else {
        alert("Failed to create the task and its sub-tasks.");
    }
  };

  // Handles creating a simple task without AI
  const handleSimpleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsLoading(true);
    const taskData: TaskRequestDto = { 
      title, 
      description, 
      priority, 
      categoryId: categoryId ? parseInt(categoryId) : null 
    };

    const success = await createTaskWithSubtasks(taskData, []); // Call with empty subtasks array
    setIsLoading(false);

    if (success) {
      onClose();
    } else {
      alert("Failed to create task. Please try again.");
    }
  };

  return (
    <>
      <AiSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSubmit={handleDecompose}
        taskTitle={title}
        isDecomposing={isDecomposing}
      />

      {aiResponseData && (
        <AiDecompositionModal 
            isOpen={isAiModalOpen}
            onClose={() => setIsAiModalOpen(false)}
            onConfirm={handleConfirmAiSubtasks}
            aiResponse={aiResponseData}
        />
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-background border border-border p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-foreground flex justify-between items-center">
                    Create a New Task
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-muted/50"><X size={20}/></button>
                  </Dialog.Title>
                  
                  <form onSubmit={handleSimpleSubmit} className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">Title</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="flex-grow rounded-md border-border bg-muted/30 focus:border-primary focus:ring-primary py-2 px-3"/>
                        <button type="button" onClick={handleDecomposeClick} disabled={isDecomposing} className="p-2 rounded-md border border-border text-primary hover:bg-muted/50 disabled:opacity-50 disabled:cursor-wait">
                            {isDecomposing ? <Loader2 size={20} className="animate-spin"/> : <Wand2 size={20} />}
                        </button>
                      </div>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">Description (Optional)</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-border bg-muted/30 focus:border-primary focus:ring-primary py-2 px-3"/>
                    </div>
                     <div className="flex space-x-4">
                            <div className="w-1-2">
                                <label htmlFor="priority" className="block text-sm font-medium text-muted-foreground">Priority</label>
                                <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="mt-1 block w-full rounded-md border-border bg-muted/30 focus:border-primary focus:ring-primary py-2 px-3">
                                    {Object.keys(PriorityOptions).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="category" className="block text-sm font-medium text-muted-foreground">Category</label>
                                <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full rounded-md border-border bg-muted/30 focus:border-primary focus:ring-primary py-2 px-3">
                                    <option value="">No Category</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                     </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted/50">
                          Cancel
                      </button>
                      <button type="submit" disabled={isLoading} className={clsx("inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-opacity-90", { "opacity-50 cursor-not-allowed": isLoading })}>
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5"/> : 'Create Task'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
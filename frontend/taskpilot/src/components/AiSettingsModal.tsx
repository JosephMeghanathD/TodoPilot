// src/components/AiSettingsModal.tsx

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, type FormEvent } from 'react';
import { Loader2, X, Wand2 } from 'lucide-react';
import type { AiDecompositionRequest } from '../api/types';
import clsx from 'clsx';

// --- THIS IS THE FIX ---
// Define the correct props interface for THIS component.
interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (settings: Omit<AiDecompositionRequest, 'task'>) => void;
  taskTitle: string;
  isDecomposing: boolean;
}

// Use the correct props interface and destructure the correct props.
export default function AiSettingsModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  taskTitle, 
  isDecomposing 
}: AiSettingsModalProps) {
  const [context, setContext] = useState('');
  const [maximumSteps, setMaximumSteps] = useState(5);
  const [maximumTimeHours, setMaximumTimeHours] = useState(8);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      context,
      maximum_steps: maximumSteps,
      maximum_time_hours: maximumTimeHours,
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-background border border-border p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-foreground flex justify-between items-center">
                  <span className='flex items-center'><Wand2 className='mr-2 text-primary'/> Decompose Task with AI</span>
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-muted/50"><X size={20}/></button>
                </Dialog.Title>
                
                <p className="mt-2 text-sm text-muted-foreground">
                    Provide some details to help the AI break down the task: <strong className="text-foreground">{taskTitle}</strong>
                </p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="context" className="block text-sm font-medium text-muted-foreground">Context (Optional)</label>
                    <textarea id="context" value={context} onChange={(e) => setContext(e.target.value)} rows={3} placeholder="e.g., for a client presentation, for a personal project..." className="mt-1 block w-full rounded-md border-border bg-muted/30 focus:border-primary focus:ring-primary py-2 px-3"/>
                  </div>
                   <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="max-steps" className="block text-sm font-medium text-muted-foreground">Max Steps</label>
                            <input type="number" id="max-steps" value={maximumSteps} onChange={e => setMaximumSteps(Number(e.target.value))} min="1" max="20" className="mt-1 block w-full rounded-md border-border bg-muted/30 focus:border-primary focus:ring-primary py-2 px-3"/>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="max-hours" className="block text-sm font-medium text-muted-foreground">Max Hours</label>
                            <input type="number" id="max-hours" value={maximumTimeHours} onChange={e => setMaximumTimeHours(Number(e.target.value))} min="1" step="0.5" className="mt-1 block w-full rounded-md border-border bg-muted/30 focus:border-primary focus:ring-primary py-2 px-3"/>
                        </div>
                   </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted/50">
                        Cancel
                    </button>
                    <button type="submit" disabled={isDecomposing} className={clsx("inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-opacity-90", { "opacity-50 cursor-not-allowed": isDecomposing })}>
                      {isDecomposing ? <Loader2 className="animate-spin h-5 w-5"/> : 'Decompose'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
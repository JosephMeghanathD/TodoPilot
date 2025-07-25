// src/components/AddSubTaskForm.tsx

import { useState, type FormEvent } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Loader2 } from 'lucide-react';
import type { SubTaskRequestDto } from '../api/types';

interface AddSubTaskFormProps {
  taskId: number;
  onComplete: () => void;
}

const AddSubTaskForm = ({ taskId, onComplete }: AddSubTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addSubTask } = useTaskStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onComplete(); // If submitted empty, just cancel
      return;
    }

    setIsLoading(true);
    const subTaskData: SubTaskRequestDto = { title };
    const success = await addSubTask(taskId, subTaskData);
    setIsLoading(false);

    if (success) {
      setTitle('');
      onComplete();
    } else {
      alert('Failed to add sub-task.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-2 py-1 flex items-center space-x-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Describe the next step..."
        autoFocus
        onBlur={handleSubmit} // Submit when user clicks away
        className="flex-grow bg-transparent border-b-2 border-border focus:border-primary outline-none text-sm px-1 py-1 transition-colors"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-3 py-1 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-opacity-90 disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Add'}
      </button>
      <button
        type="button"
        onClick={onComplete}
        className="px-3 py-1 text-xs rounded-md bg-muted/40 hover:bg-muted/80"
      >
        Cancel
      </button>
    </form>
  );
};

export default AddSubTaskForm;
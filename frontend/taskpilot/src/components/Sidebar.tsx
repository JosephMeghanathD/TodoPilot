// src/components/Sidebar.tsx

import { useState, type FormEvent } from 'react';
import { useTaskStore } from "../store/taskStore";
import { useUiStore } from '../store/uiStore'; // Import UI store
import { Tag, PlusCircle } from "lucide-react";
import CategoryItem from "./CategoryItem";
import ThemeToggle from "./ThemeToggle";
import clsx from 'clsx';

const Sidebar = () => {
  const { categories, selectCategory, selectedCategoryId, addCategory } = useTaskStore();
  const { isSidebarOpen } = useUiStore(); // Get sidebar state
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreateCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
        setIsAdding(false);
        return;
    }
    addCategory({ name: newCategoryName });
    setNewCategoryName('');
    setIsAdding(false);
  };

  return (
    <aside className={clsx(
        "absolute md:relative z-40 w-64 h-full flex-shrink-0 border-r border-border flex flex-col bg-background transition-transform duration-300 ease-in-out",
        {
            'translate-x-0': isSidebarOpen, // Show sidebar on mobile
            '-translate-x-full': !isSidebarOpen, // Hide sidebar on mobile
        },
        'md:translate-x-0' // Always visible on desktop
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">// TaskPilot</h2>
        <ThemeToggle />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-semibold text-muted-foreground mb-2 px-2">CATEGORIES</h3>
        <nav className="flex flex-col space-y-1">
          <button
            onClick={() => selectCategory(null)}
            className={clsx(
                'flex items-center px-2 py-2 text-sm rounded-md transition-colors',
                selectedCategoryId === null
                ? 'bg-muted text-primary-foreground font-semibold'
                : 'text-foreground hover:bg-muted/50'
            )}
          >
            <Tag className="w-4 h-4 mr-3" />
            All Tasks
          </button>
          {categories.map((cat) => (
            <CategoryItem key={cat.id} category={cat} />
          ))}
        </nav>
      </div>
      <div className="p-4 mt-auto border-t border-border">
         {isAdding ? (
            <form onSubmit={handleCreateCategory}>
                <input 
                    type="text"
                    autoFocus
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onBlur={() => setIsAdding(false)}
                    placeholder="New category name..."
                    className="w-full text-sm bg-muted/30 border border-border rounded-md px-2 py-1.5 focus:border-primary focus:ring-primary outline-none"
                />
            </form>
         ) : (
            <button 
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center justify-center px-2 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
                <PlusCircle className="w-4 h-4 mr-2"/>
                New Category
            </button>
         )}
      </div>
    </aside>
  );
};

export default Sidebar;
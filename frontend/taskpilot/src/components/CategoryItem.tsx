// src/components/CategoryItem.tsx

import React from 'react';
import { type CategoryDto } from '../api/types';
import { useTaskStore } from '../store/taskStore';
import { Folder, Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface CategoryItemProps {
  category: CategoryDto;
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  const { selectedCategoryId, selectCategory, deleteCategory } = useTaskStore();
  const isActive = category.id === selectedCategoryId;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the category from being selected when clicking delete
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This cannot be undone.`)) {
        deleteCategory(category.id);
    }
  };

  return (
    <div className="flex items-center group">
      <button
        onClick={() => selectCategory(category.id)}
        className={clsx(
          'flex items-center w-full text-left px-2 py-2 text-sm rounded-md transition-colors',
          {
            'bg-muted text-primary-foreground font-semibold': isActive,
            'text-foreground hover:bg-muted/50': !isActive,
          }
        )}
      >
        <Folder className="w-4 h-4 mr-3" />
        <span className="flex-grow truncate">{category.name}</span>
      </button>

      {/* Delete button appears on group hover */}
      <button 
        onClick={handleDelete}
        className="ml-1 p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-900/40 opacity-0 group-hover:opacity-100 transition-opacity"
        title={`Delete "${category.name}"`}
      >
          <Trash2 size={14} />
      </button>
    </div>
  );
};

export default CategoryItem;
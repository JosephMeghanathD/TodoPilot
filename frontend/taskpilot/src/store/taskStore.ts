// src/store/taskStore.ts

import { create } from 'zustand';
import todoApiClient from '../lib/todoApi';
import type { CategoryDto, TaskDto, TaskRequestDto, SubTaskRequestDto, SubTaskDto, AiDecompositionResponse, AiDecompositionRequest, CategoryRequestDto } from '../api/types';

interface TaskState {
  // STATE
  categories: CategoryDto[];
  tasks: TaskDto[];
  selectedCategoryId: number | null;
  expandedTaskIds: Set<number>;
  isLoading: boolean;
  error: string | null;

  // ACTIONS
  fetchCategories: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  selectCategory: (categoryId: number | null) => void;
  toggleTaskExpansion: (taskId: number) => void;
  addTask: (taskData: TaskRequestDto) => Promise<boolean>;
  addSubTask: (taskId: number, subTaskData: SubTaskRequestDto) => Promise<boolean>;
  toggleTaskCompletion: (taskId: number) => Promise<void>;
  toggleSubTaskCompletion: (taskId: number, subTaskId: number) => Promise<void>;
  decomposeTask: (request: AiDecompositionRequest) => Promise<AiDecompositionResponse | null>;
  batchAddSubTasks: (taskId: number, subtasks: SubTaskRequestDto[]) => Promise<boolean>; // The new batch action
  createTaskWithSubtasks: (taskData: TaskRequestDto, subtasks: SubTaskRequestDto[]) => Promise<boolean>;
  addDecomposedSubtasksToExistingTask: (taskId: number, subtasks: SubTaskRequestDto[]) => Promise<boolean>;
  deleteTask: (taskId: number) => Promise<void>;
  deleteSubTask: (taskId: number, subTaskId: number) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
  addCategory: (categoryData: CategoryRequestDto) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // INITIAL STATE
  categories: [],
  tasks: [],
  selectedCategoryId: null,
  expandedTaskIds: new Set(),
  isLoading: true,
  error: null,

  // ACTION IMPLEMENTATIONS
  fetchCategories: async () => {
    try {
      set((state) => ({ isLoading: state.isLoading || true }));
      const response = await todoApiClient.get<CategoryDto[]>('/categories');
      set({ categories: response.data, error: null });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch categories.';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTasks: async () => {
    try {
      set({ isLoading: true });
      const response = await todoApiClient.get<TaskDto[]>('/tasks');
      set({ tasks: response.data, error: null });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks.';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  selectCategory: (categoryId: number | null) => {
    set({ selectedCategoryId: categoryId });
  },

  toggleTaskExpansion: (taskId: number) => {
    set((state) => {
      const newExpandedTaskIds = new Set(state.expandedTaskIds);
      if (newExpandedTaskIds.has(taskId)) {
        newExpandedTaskIds.delete(taskId);
      } else {
        newExpandedTaskIds.add(taskId);
      }
      return { expandedTaskIds: newExpandedTaskIds };
    });
  },

  addTask: async (taskData: TaskRequestDto) => {
    try {
      const response = await todoApiClient.post<TaskDto>('/tasks', taskData);
      set((state) => ({
        tasks: [...state.tasks, response.data],
      }));
      return true;
    } catch (err) {
      console.error("Failed to add task:", err);
      return false;
    }
  },

  // --- NEW ---
  addSubTask: async (taskId: number, subTaskData: SubTaskRequestDto) => {
    try {
        const response = await todoApiClient.post<SubTaskDto>(`/tasks/${taskId}/subtasks`, subTaskData);
        const newSubTask = response.data;

        // Update the specific task in the tasks array with the new sub-task
        set((state) => ({
            tasks: state.tasks.map(task => 
                task.id === taskId 
                    ? { ...task, subTasks: [...task.subTasks, newSubTask] } 
                    : task
            ),
        }));
        return true;
    } catch (err) {
        console.error("Failed to add sub-task:", err);
        return false;
    }
  },

  toggleTaskCompletion: async (taskId: number) => {
    try {
        const response = await todoApiClient.post<TaskDto>(`/tasks/${taskId}/toggle-complete`);
        const updatedTask = response.data;
        set(state => ({
            tasks: state.tasks.map(task => task.id === taskId ? updatedTask : task),
        }));
    } catch (err) {
        console.error("Failed to toggle task completion:", err);
        // Optionally revert state on failure
    }
  },

  // --- NEW ---
  toggleSubTaskCompletion: async (taskId: number, subTaskId: number) => {
    try {
        const response = await todoApiClient.post<SubTaskDto>(`/tasks/${taskId}/subtasks/${subTaskId}/toggle-complete`);
        const updatedSubTask = response.data;
        set(state => ({
            tasks: state.tasks.map(task => {
                if (task.id !== taskId) return task;
                return {
                    ...task,
                    subTasks: task.subTasks.map(st => st.id === subTaskId ? updatedSubTask : st),
                };
            }),
        }));
    } catch (err) {
        console.error("Failed to toggle sub-task completion:", err);
    }
  },

  decomposeTask: async (request: AiDecompositionRequest) => {
    try {
        const response = await todoApiClient.post<AiDecompositionResponse>('/ai/decompose-task', request);
        return response.data;
    } catch (err) {
        console.error("Failed to decompose task:", err);
        return null;
    }
  },

  batchAddSubTasks: async (taskId: number, subtasks: SubTaskRequestDto[]) => {
    if (subtasks.length === 0) return true; // Nothing to do
    try {
        // Assume the API returns the list of newly created sub-tasks
        const response = await todoApiClient.post<SubTaskDto[]>(`/tasks/${taskId}/subtasks/batch`, subtasks);
        const newSubTasks = response.data;
        
        // Update the parent task's subtask list immutably
        set(state => ({
            tasks: state.tasks.map(task => 
                task.id === taskId
                    ? { ...task, subTasks: [...task.subTasks, ...newSubTasks] }
                    : task
            )
        }));
        return true;
    } catch (err) {
        console.error("Failed to batch add sub-tasks:", err);
        return false;
    }
  },

  // --- REFACTORED ACTIONS ---

  createTaskWithSubtasks: async (taskData: TaskRequestDto, subtasks: SubTaskRequestDto[]) => {
    try {
        // 1. Create the parent task first
        const taskResponse = await get().addTask(taskData);
        if (!taskResponse) throw new Error("Parent task creation failed.");

        // We need to find the newly created task to get its ID.
        // A robust way is to fetch tasks again, but for a quicker UI, we can find the task.
        // Let's refetch for guaranteed consistency.
        await get().fetchTasks();
        
        // Find the newly created task (assuming titles are unique for a moment)
        const allTasks = get().tasks;
        const newParentTask = allTasks.find(t => t.title === taskData.title && t.subTasks.length === 0);

        if (newParentTask && subtasks.length > 0) {
            // 2. Add all sub-tasks in a single batch request
            await get().batchAddSubTasks(newParentTask.id, subtasks);
        }
        return true;
    } catch (err) {
        console.error("Failed to create task with sub-tasks:", err);
        return false;
    }
  },

  addDecomposedSubtasksToExistingTask: async (taskId: number, subtasks: SubTaskRequestDto[]) => {
    try {
        // Simply call the batch add function for an existing task
        const success = await get().batchAddSubTasks(taskId, subtasks);
        return success;
    } catch (err) {
        console.error("Failed to add decomposed sub-tasks to existing task:", err);
        return false;
    }
  },

  deleteTask: async (taskId: number) => {
    try {
        await todoApiClient.delete(`/tasks/${taskId}`);
        // Optimistically remove the task from the local state
        set(state => ({
            tasks: state.tasks.filter(task => task.id !== taskId),
        }));
    } catch (err) {
        console.error("Failed to delete task:", err);
        alert("Failed to delete task. Please try again.");
    }
  },

  deleteSubTask: async (taskId: number, subTaskId: number) => {
    try {
        await todoApiClient.delete(`/tasks/${taskId}/subtasks/${subTaskId}`);
        // Optimistically remove the subtask from the specific parent task's array
        set(state => ({
            tasks: state.tasks.map(task => {
                if (task.id !== taskId) return task;
                return {
                    ...task,
                    subTasks: task.subTasks.filter(st => st.id !== subTaskId),
                };
            }),
        }));
    } catch (err) {
        console.error("Failed to delete sub-task:", err);
        alert("Failed to delete sub-task. Please try again.");
    }
  },

  // --- NEW ACTION ---
  deleteCategory: async (categoryId: number) => {
    try {
        await todoApiClient.delete(`/categories/${categoryId}`);
        
        // On success, update the local state
        set(state => {
            const newState: Partial<TaskState> = {
                // Filter out the deleted category
                categories: state.categories.filter(c => c.id !== categoryId),
            };
            // If the deleted category was selected, go back to "All Tasks"
            if (state.selectedCategoryId === categoryId) {
                newState.selectedCategoryId = null;
            }
            return newState;
        });

        // Re-fetch tasks to ensure consistency for any tasks that were in the deleted category
        await get().fetchTasks();

    } catch (err: any) {
        console.error("Failed to delete category:", err);
        // Display specific backend error message if available
        const errorMessage = err.response?.data?.message || "An unknown error occurred.";
        alert(`Error: ${errorMessage}`);
    }
  },

  addCategory: async (categoryData: CategoryRequestDto) => {
    try {
        const response = await todoApiClient.post<CategoryDto>('/categories', categoryData);
        const newCategory = response.data;
        
        // Optimistically add the new category to the local state
        set(state => ({
            categories: [...state.categories, newCategory]
        }));
    } catch (err: any) {
        console.error("Failed to add category:", err);
        const errorMessage = err.response?.data?.message || "Could not create category.";
        alert(`Error: ${errorMessage}`);
    }
  },
}));
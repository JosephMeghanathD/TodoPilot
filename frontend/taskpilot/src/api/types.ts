// src/api/types.ts

export interface LoginRequest {
    email:    string;
    password: string;
  }

  export interface UserRegistrationRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';


export interface CategoryDto {
  id: number;
  name: string;
}

export interface SubTaskDto {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null; // Dates come as ISO strings
  taskId: number;
}

export interface TaskDto {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  category: CategoryDto | null;
  subTasks: SubTaskDto[];
}

// Types for creating/updating data
export interface CategoryRequestDto {
  name: string;
}

export interface TaskRequestDto {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
  categoryId?: number | null;
}

export interface SubTaskRequestDto {
  title: string;
  description?: string;
  dueDate?: string | null;
}

export interface AiDecompositionRequest {
  task: string;
  context?: string;
  maximum_time_hours: number;
  maximum_steps: number;
}

export interface AiSubtaskDetail {
  title: string;
  description: string;
  estimated_time_hours: number;
}

export interface AiDecompositionResponse {
  task: string;
  context: string;
  subtasks: AiSubtaskDetail[];
  total_estimated_time_hours: number;
}

export const PriorityOptions: Record<Priority, string> = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  NONE: 'NONE',
};
// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

// Project Types
export interface Project {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  creator_id: number;
  collaborators: number[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

// Task Types
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  due_date: string;
  image_url: string;
  project_id: number;
  creator_id: number;
}

export interface CreateTaskData {
  title: string;
  status: TaskStatus;
  due_date: string;
  image_url: string;
  project_id: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Filter Types
export interface TaskFilters {
  search?: string;
  status?: TaskStatus;
  project_id?: number;
  page?: number;
  limit?: number;
}

// RandomUser.me external API Types
export interface RandomUserResponse {
  results: RandomUser[];
  info: {
    page: number;
    results: number;
  };
}

export interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    thumbnail: string;
    medium: string;
    large: string;
  };
}

// Form Types
export interface ProjectFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface TaskFormData {
  title: string;
  status: TaskStatus;
  due_date: string;
  image_url: string;
}

// Route Protection Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}
export interface RegisterRequest {
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
}

export interface Task {
    id?: number;
    title: string;
    description: string;
    dueDate: Date | null;
    taskPriority: 'Low' | 'Medium' | 'High';
    taskStatus: 'Pending' | 'Completed';
    createdAt?: Date;
    userId?: string;
}

export interface TaskRequest {
    id: number;
    title: string;
    description: string;
    dueDate: Date | null;
    priority: number;
    status: number;
}
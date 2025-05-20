export interface Task {
    id: number;
    text: string;
    isCompleted: boolean;
}

export interface CreateTaskPayload {
    text: string;
}

export interface UpdateTaskPayload {
    text?: string;
    isCompleted?: boolean;
}
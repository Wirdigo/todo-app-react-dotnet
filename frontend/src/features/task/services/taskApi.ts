import apiClient from "../../../services/apiClient";
import  {Task, CreateTaskPayload, UpdateTaskPayload} from "../types/Task";


const TASKS_ENDPOINT = '/tasks';

export const getTasks = async (): Promise<Task[]>=> {
    const response = await apiClient.get<Task[]>(TASKS_ENDPOINT);
    return response.data;
}

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
    const response = await apiClient.post<Task>(TASKS_ENDPOINT, payload);
    return response.data;
}

export const updateTask = async (id: number, payload: UpdateTaskPayload): Promise<Task> => {
    const response = await apiClient.put<Task>(`${TASKS_ENDPOINT}/${id}`, payload);
    return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await apiClient.delete(`${TASKS_ENDPOINT}/${id}`);
}
import React from 'react'
import {Task, UpdateTaskPayload} from "../task/types/Task";
import TaskItem from "./TaskItem";

interface TaskListProps {
    tasks: Task[];
    onToggleComplete: (id: number, payload: UpdateTaskPayload) => void;
    onDeleteTask: (id: number) => void;
    isLoading?: boolean;
    error?: string | null;
}

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onToggleComplete,
    onDeleteTask,
    isLoading,
    error
}) => {
    if (isLoading)
    {
        return (<p>Loading tasks</p>)
    }
    if (error)
    {
        return (<p style={{color: "red"}}>Error loading tasks: {error}</p>)
    }
    return (
        <ul>
            {tasks.map((task: Task) => (
                <TaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} onDelete={onDeleteTask} />
            ))}
        </ul>
    );
};
export default TaskList;
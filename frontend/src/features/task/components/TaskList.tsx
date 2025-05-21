import React from 'react'
import {Task, UpdateTaskPayload} from "../types/Task";
import TaskItem from "./TaskItem";
import { Flipper, Flipped } from 'react-flip-toolkit';

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
    const listKey = tasks.map(task => `${task.id}-${task.isCompleted}`).join(',');
    return (
        <Flipper
            flipKey={listKey}
            spring="gentle"
            className="task-list"
            element="main"
        >
            {tasks.map((task: Task) => (
                <Flipped key={task.id} flipId={task.id}>
                    <div style={{ width: '100%' }}>
                        <TaskItem
                            task={task}
                            onToggleComplete={onToggleComplete}
                            onDelete={onDeleteTask}
                        />
                    </div>
                </Flipped>
            ))}
        </Flipper>
    );
};
export default TaskList;
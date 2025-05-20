import React from 'react';
import { Task, UpdateTaskPayload } from "../task/types/Task";

interface TodoItemProps {
    task: Task;
    onToggleComplete: (id: number, payload: UpdateTaskPayload) => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ task, onToggleComplete, onDelete }) => {
    const handleToggle = () => {
        onToggleComplete(task.id, { isCompleted: !task.isCompleted });
    };

    return (
        <li>
      <span style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
        {task.text}
      </span>
            <button onClick={handleToggle}>
                {task.isCompleted ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </li>
    );
};

export default TodoItem;
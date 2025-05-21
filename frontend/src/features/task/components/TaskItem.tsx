import React from 'react';
import { Task, UpdateTaskPayload} from "../types/Task";
import styles from './TaskItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";

interface TodoItemProps {
    task: Task;
    onToggleComplete: (id: number, payload: UpdateTaskPayload) => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ task, onToggleComplete, onDelete }) => {
    const handleToggle = () => {
        onToggleComplete(task.id, { isCompleted: !task.isCompleted });
    };

    const handleDelete = () => {
        onDelete(task.id);
    };

    return (
        <div className={`${styles.taskItem} ${task.isCompleted ? styles.taskCompleted : ''}`}>
            <span className={styles.taskIconLeft}>✴</span>
            <p className={styles.taskText}>{task.text}</p>
            <div className={styles.taskActions}>
                <span
                    className={`${styles.actionIcon} ${styles.trashIcon}`}
                    onClick={handleDelete}
                    title="Delete task"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </span>
                <span
                    className={`${styles.actionIcon} ${styles.statusIcon} ${
                        task.isCompleted ? styles.statusDone : ''
                    }`}
                    onClick={handleToggle}
                    title={task.isCompleted ? "Mark as pending" : "Mark as completed"}
                />
            </div>
        </div>
    );
};

export default TodoItem;
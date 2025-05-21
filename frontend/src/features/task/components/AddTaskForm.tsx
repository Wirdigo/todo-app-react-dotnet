import React, { useState, useEffect, useRef } from 'react';
import { CreateTaskPayload } from '../types/Task';
import pageStyles from '../../../pages/TaskPage.module.css';

interface AddTaskFormProps {
    onCreateTask: (payload: CreateTaskPayload) => Promise<void>; 
    onCancel: () => void; 
    isLoading: boolean; 
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onCreateTask, onCancel, isLoading }) => {
    const [taskText, setTaskText] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskText(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (taskText.trim() === "") return;
        await onCreateTask({ text: taskText.trim() });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) { 
            event.preventDefault(); 
            if (taskText.trim() !== "") {
                const fakeFormEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
                handleSubmit(fakeFormEvent);
            }
        } else if (event.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit} className={pageStyles.addTaskFormContainer}>
            <input
                ref={inputRef}
                type="text"
                className={pageStyles.addTaskInput}
                value={taskText}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="What needs to be done?"
                disabled={isLoading}
            />
            <button
                type="submit"
                className={pageStyles.addTaskButton}
                disabled={taskText.trim() === "" || isLoading}
            >
                {isLoading ? 'Adding...' : 'Add Task'}
            </button>
        </form>
    );
};

export default AddTaskForm;
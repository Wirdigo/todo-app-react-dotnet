import React, { useState, useEffect, useRef } from 'react';
import {Task, UpdateTaskPayload, CreateTaskPayload} from "../features/task/types/Task";
import TaskList from "../features/task/components/TaskList";
import {getTasks, updateTask, deleteTask, createTask} from "../features/task/services/taskApi";
import PageHeader from "../components/PageHeader";
import NoTasksMessage from "../features/task/components/NoTasksMessage";
import AddTaskForm from "../features/task/components/AddTaskForm";
const TaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]).sort();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddingTask, setIsAddingTask] = useState<boolean>(false); 
    const [newTaskText, setNewTaskText] = useState<string>(""); 
    const newTaskInputRef = useRef<HTMLInputElement>(null); 


    useEffect(() => {
        const fetchTask = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedTasks = await getTasks();
                setTasks(fetchedTasks);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, []);

    useEffect(() => {
        if (isAddingTask && newTaskInputRef.current) {
            newTaskInputRef.current.focus();
        }
    }, [isAddingTask]);

    const handleCreateTask = async (payload: CreateTaskPayload) => {
        if (payload.text.trim() === "") return;
        setIsLoading(true);
        setError(null);
        try {
            const createdTask = await createTask(payload);
            setTasks(prevTasks => [...prevTasks, createdTask]);
            setIsAddingTask(false);
        } catch (err) {
            console.error('Failed to create task:', err);
            setError(err instanceof Error ? err.message : 'Failed to create task');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelAddTask = () => {
        setIsAddingTask(false);
    };

    const handleToggleAddTask = () => {
        setIsAddingTask(prev => !prev);
    };

    const handleToggleComplete = async (id: number, payload: UpdateTaskPayload) => {
        try {
            const updatedTask = await updateTask(id, payload);
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === id ? updatedTask : task))
            );
        } catch (err) {
            console.error('Failed to update task:', err);
        }
    }

    const handleDeleteTask = async (id: number) => {
        try {
            await deleteTask(id);
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    return (
        <div className={"todo-bg"}>
            <PageHeader isAddingTask={isAddingTask} onToggleAddTask={handleToggleAddTask}/>
            {isAddingTask && (
                <AddTaskForm
                    onCreateTask={handleCreateTask}
                    onCancel={handleCancelAddTask}
                    isLoading={isLoading}
                />
            )}
            {tasks.length == 0?(
                <NoTasksMessage/>
            ):(
                <TaskList
                    tasks={tasks}
                    onToggleComplete={handleToggleComplete}
                    onDeleteTask={handleDeleteTask}
                    isLoading={isLoading}
                    error={error}
                />
            )}
        </div>
    );
}
export default TaskPage;
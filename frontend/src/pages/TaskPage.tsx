import React, { useState, useEffect } from 'react';
import {Task, UpdateTaskPayload} from "../features/task/types/Task";
import TaskList from "../features/components/TaskList";
import {getTasks, updateTask, deleteTask} from "../features/task/services/taskApi";


const TaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try{
                setIsLoading(true);
                setError(null);
                const fetchedTasks = await getTasks();
                setTasks(fetchedTasks);
            }
            catch (err)
            {
                setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
            }
            finally
            {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, []);

    const handleToggleComplete = async (id: number, payload: UpdateTaskPayload)=> {
        try {
            const updatedTask = await updateTask(id, payload);
            setTasks((prevTasks) =>
                prevTasks.map((task) =>(task.id === id ? updatedTask : task))
            );
        }
        catch (err)
        {
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
        <div>
            <h1>My Todo List</h1>
            <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
}

export default TaskPage;
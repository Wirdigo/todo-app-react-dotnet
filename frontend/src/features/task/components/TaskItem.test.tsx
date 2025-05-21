import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Для додаткових matchers як toBeInTheDocument
import TaskItem from './TaskItem';
import { Task, UpdateTaskPayload } from '../types/Task';

// Мок-функції для props
const mockOnToggleComplete = jest.fn();
const mockOnDelete = jest.fn();

const sampleTask: Task = {
    id: 1,
    text: 'Test Task Item',
    isCompleted: false,
};

const completedSampleTask: Task = {
    id: 2,
    text: 'Completed Test Task',
    isCompleted: true,
};

describe('TaskItem Component', () => {
    beforeEach(() => {
        // Очищуємо моки перед кожним тестом
        mockOnToggleComplete.mockClear();
        mockOnDelete.mockClear();
    });

    test('renders task text correctly', () => {
        render(
            <TaskItem
                task={sampleTask}
                onToggleComplete={mockOnToggleComplete}
                onDelete={mockOnDelete}
            />
        );
        // Перевіряємо, чи текст завдання є на екрані
        expect(screen.getByText('Test Task Item')).toBeInTheDocument();
    });

    test('applies completed style when task is completed', () => {
        render(
            <TaskItem
                task={completedSampleTask}
                onToggleComplete={mockOnToggleComplete}
                onDelete={mockOnDelete}
            />
        );
        const taskTextElement = screen.getByText('Completed Test Task');
        expect(taskTextElement).toBeInTheDocument();

    });

    test('calls onToggleComplete with correct payload when status icon is clicked', () => {
        render(
            <TaskItem
                task={sampleTask}
                onToggleComplete={mockOnToggleComplete}
                onDelete={mockOnDelete}
            />
        );
        const statusIcon = screen.getByTitle('Mark as completed');
        fireEvent.click(statusIcon);

        expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
        expect(mockOnToggleComplete).toHaveBeenCalledWith(sampleTask.id, {
            isCompleted: !sampleTask.isCompleted,
        });
    });

    test('calls onDelete with correct id when delete icon is clicked', () => {
        render(
            <TaskItem
                task={sampleTask}
                onToggleComplete={mockOnToggleComplete}
                onDelete={mockOnDelete}
            />
        );
        const deleteIcon = screen.getByTitle('Delete task');
        fireEvent.click(deleteIcon);

        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith(sampleTask.id);
    });
});
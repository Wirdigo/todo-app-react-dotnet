import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddTaskForm from './AddTaskForm';

const mockOnCreateTask = jest.fn(() => Promise.resolve()); // Мокуємо як асинхронну функцію
const mockOnCancel = jest.fn();

describe('AddTaskForm Component', () => {
    beforeEach(() => {
        mockOnCreateTask.mockClear();
        mockOnCancel.mockClear();
    });


    test('renders input field and add button', () => {
        render(<AddTaskForm onCreateTask={mockOnCreateTask} onCancel={mockOnCancel} isLoading={false} />);
        expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    test('allows user to type in the input field', () => {
        render(<AddTaskForm onCreateTask={mockOnCreateTask} onCancel={mockOnCancel} isLoading={false} />);
        const inputElement = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: 'New Test Task' } });
        expect(inputElement.value).toBe('New Test Task');
    });

    test('calls onCreateTask with the input text when form is submitted', async () => {
        render(<AddTaskForm onCreateTask={mockOnCreateTask} onCancel={mockOnCancel} isLoading={false} />);
        const inputElement = screen.getByPlaceholderText('What needs to be done?');
        const addButton = screen.getByRole('button', { name: /add task/i });

        fireEvent.change(inputElement, { target: { value: 'Submit This Task' } });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockOnCreateTask).toHaveBeenCalledTimes(1);
        });
        expect(mockOnCreateTask).toHaveBeenCalledWith({ text: 'Submit This Task' });
    });

    test('does not call onCreateTask if input is empty and submit is clicked', () => {
        render(<AddTaskForm onCreateTask={mockOnCreateTask} onCancel={mockOnCancel} isLoading={false} />);
        const addButton = screen.getByRole('button', { name: /add task/i });

        fireEvent.click(addButton);

        expect(mockOnCreateTask).not.toHaveBeenCalled();
    });

    test('button is disabled if input is empty', () => {
        render(<AddTaskForm onCreateTask={mockOnCreateTask} onCancel={mockOnCancel} isLoading={false} />);
        const addButton = screen.getByRole('button', { name: /add task/i });
        expect(addButton).toBeDisabled();

        const inputElement = screen.getByPlaceholderText('What needs to be done?');
        fireEvent.change(inputElement, { target: { value: 'Some text' } });
        expect(addButton).not.toBeDisabled();
    });

    test('calls onCancel when Escape key is pressed in input', () => {
        render(<AddTaskForm onCreateTask={mockOnCreateTask} onCancel={mockOnCancel} isLoading={false} />);
        const inputElement = screen.getByPlaceholderText('What needs to be done?');
        fireEvent.keyDown(inputElement, { key: 'Escape', code: 'Escape' });
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
});
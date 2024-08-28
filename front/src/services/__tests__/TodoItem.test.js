import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';  // Assurez-vous d'importer ceci
import TodoItem from '../../components/TodoItem';

describe('TodoItem', () => {
  const mockTodo = { _id: '1', text: 'Test todo', completed: false };
  const mockToggleTodo = jest.fn();
  const mockRemoveTodo = jest.fn();

  it('displays the correct text for the todo', () => {
    const { getByText } = render(
      <TodoItem todo={mockTodo} toggleTodo={mockToggleTodo} removeTodo={mockRemoveTodo} />
    );

    const todoText = getByText('Test todo');
    expect(todoText).toBeInTheDocument();
  });

  it('renders with the correct completed state', () => {
    const { getByRole } = render(
      <TodoItem todo={mockTodo} toggleTodo={mockToggleTodo} removeTodo={mockRemoveTodo} />
    );

    const checkbox = getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    // Test with completed state
    const completedTodo = { ...mockTodo, completed: true };
    const { getAllByText: getAllByTextCompleted } = render(
      <TodoItem todo={completedTodo} toggleTodo={mockToggleTodo} removeTodo={mockRemoveTodo} />
    );

    const completedTexts = getAllByTextCompleted('Test todo');
    const completedText = completedTexts.find((element) => 
      element.classList.contains('text-muted') && 
      element.classList.contains('text-decoration-line-through')
    );

    expect(completedText).toHaveClass('text-muted text-decoration-line-through');
  });

  it('calls toggleTodo when the checkbox is clicked', () => {
    const { getByRole } = render(
      <TodoItem todo={mockTodo} toggleTodo={mockToggleTodo} removeTodo={mockRemoveTodo} />
    );

    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockToggleTodo).toHaveBeenCalledWith(mockTodo._id);
  });

  it('calls removeTodo when the delete button is clicked', () => {
    const { getByRole } = render(
      <TodoItem todo={mockTodo} toggleTodo={mockToggleTodo} removeTodo={mockRemoveTodo} />
    );

    const deleteButton = getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockRemoveTodo).toHaveBeenCalledWith(mockTodo._id);
  });
});

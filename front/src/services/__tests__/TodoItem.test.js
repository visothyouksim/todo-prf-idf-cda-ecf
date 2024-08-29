import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';  // Assurez-vous d'importer ceci
import TodoItem from '../../components/TodoItem';

describe('TodoItem', () => {
  const mockTodo = { _id: '1', text: 'Test todo', completed: false };
  const mockToggleTodo = jest.fn();
  const mockRemoveTodo = jest.fn();

  it('affiche le texte correct pour le todo', () => {
    const { getByText } = render(
      <TodoItem todo={mockTodo} toggleTodo={mockToggleTodo} removeTodo={mockRemoveTodo} />
    );

    const todoText = getByText('Test todo');
    expect(todoText).toBeInTheDocument();
  });

  it('est rendu avec l\'état complété correct', () => {
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

  it('appelle toggleTodo lorsque la case à cocher est cliquée', () => {
    const { getByRole } = render(
      <TodoItem todo={mockTodo} toggleTodo={mockToggleTodo} removeTodo={mockRemoveTodo} />
    );

    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockToggleTodo).toHaveBeenCalledWith(mockTodo._id);
  });

  it('appelle removeTodo lorsque le bouton de suppression est cliqué', () => {
    const { getByRole } = render(
      <TodoItem todo={mockTodo} toggleTodo={mockToggleTodo} removeTodo={mockRemoveTodo} />
    );

    const deleteButton = getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockRemoveTodo).toHaveBeenCalledWith(mockTodo._id);
  });
});

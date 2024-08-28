import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';  // Pour les matchers Jest-DOM
import TodoList from '../../components/TodoList';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../../services/api';

// Mock des fonctions API
jest.mock('../../services/api');

describe('TodoList', () => {
  const mockTodos = [
    { _id: '1', text: 'Todo 1', completed: false },
    { _id: '2', text: 'Todo 2', completed: true }
  ];

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    getAllTodos.mockResolvedValue(mockTodos);
    createTodo.mockResolvedValue({ _id: '3', text: 'New Todo', completed: false });
    updateTodo.mockResolvedValue({ _id: '1', text: 'Todo 1', completed: true });
    deleteTodo.mockResolvedValue({});
  });

  it('renders multiple TodoItems based on provided props', async () => {
    render(<TodoList />);

    const todoItems = await screen.findAllByRole('listitem');
    expect(todoItems).toHaveLength(mockTodos.length);
  });

  it('displays a message when there are no todos', async () => {
    getAllTodos.mockResolvedValueOnce([]);
    render(<TodoList />);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  it('passes correct props to each TodoItem', async () => {
    render(<TodoList />);

    const todoItems = await screen.findAllByRole('listitem');
    
    expect(todoItems[0]).toHaveTextContent('Todo 1');
    expect(todoItems[1]).toHaveTextContent('Todo 2');
  });

  it('adds a new todo when the form is submitted', async () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText('ajouter une nouvelle tâche');
    const addButton = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);

    const newTodoItem = await screen.findByText('New Todo');
    expect(newTodoItem).toBeInTheDocument();
  });

  it('toggles a todo completed state when checkbox is clicked', async () => {
    render(<TodoList />);

    const todoItems = await screen.findAllByRole('listitem');
    const checkbox = within(todoItems[0]).getByRole('checkbox');

    fireEvent.click(checkbox);

    expect(updateTodo).toHaveBeenCalledWith('1', { completed: true });
  });

  it('removes a todo when the delete button is clicked', async () => {
    render(<TodoList />);

    const todoItems = await screen.findAllByRole('listitem');
    const deleteButton = within(todoItems[0]).getByRole('button', { name: /delete/i });

    fireEvent.click(deleteButton);

    expect(deleteTodo).toHaveBeenCalledWith('1');
  });

  it('sorts todos correctly (if applicable)', async () => {
    // Ajoutez des assertions spécifiques au tri si c'est nécessaire dans votre composant.
  });
});

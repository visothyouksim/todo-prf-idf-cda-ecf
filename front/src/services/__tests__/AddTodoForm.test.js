import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddTodoForm from '../../components/AddTodoForm';

describe('AddTodoForm', () => {
  it('renders the form with an input field and a submit button', () => {
    const { getByPlaceholderText, getByRole } = render(<AddTodoForm />);

    const input = getByPlaceholderText('ajouter une nouvelle tâche');
    const button = getByRole('button', { name: /add todo/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('updates local state when text is entered', () => {
    const { getByPlaceholderText } = render(<AddTodoForm />);
    const input = getByPlaceholderText('ajouter une nouvelle tâche');

    fireEvent.change(input, { target: { value: 'New Todo' } });

    expect(input.value).toBe('New Todo');
  });

  it('calls addTodo function on form submission', () => {  
    const addTodo = jest.fn();  
    const { getByPlaceholderText, getByRole } = render(<AddTodoForm addTodo={addTodo} />);  

    const input = getByPlaceholderText('ajouter une nouvelle tâche');
    const button = getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);

    expect(addTodo).toHaveBeenCalledWith('New Todo');  
  });

  it('resets the input field after form submission', () => {
    const addTodo = jest.fn();  
    const { getByPlaceholderText, getByRole } = render(<AddTodoForm addTodo={addTodo} />);  

    const input = getByPlaceholderText('ajouter une nouvelle tâche');
    const button = getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);

    expect(input.value).toBe('');
  });
});

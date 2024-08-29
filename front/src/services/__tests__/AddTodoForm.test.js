import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddTodoForm from '../../components/AddTodoForm';

describe('AddTodoForm', () => {
  it('rend le formulaire avec un champ de saisie et un bouton de soumission', () => {
    const { getByPlaceholderText, getByRole } = render(<AddTodoForm />);

    const input = getByPlaceholderText('ajouter une nouvelle tâche');
    const button = getByRole('button', { name: /add todo/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('met à jour l\'état local lorsque du texte est saisi', () => {
    const { getByPlaceholderText } = render(<AddTodoForm />);
    const input = getByPlaceholderText('ajouter une nouvelle tâche');

    fireEvent.change(input, { target: { value: 'New Todo' } });

    expect(input.value).toBe('New Todo');
  });

  it('appelle la fonction addTodo lors de la soumission du formulaire', () => {  
    const addTodo = jest.fn();  
    const { getByPlaceholderText, getByRole } = render(<AddTodoForm addTodo={addTodo} />);  

    const input = getByPlaceholderText('ajouter une nouvelle tâche');
    const button = getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);

    expect(addTodo).toHaveBeenCalledWith('New Todo');  
  });

  it('réinitialise le champ de saisie après la soumission du formulaire', () => {
    const addTodo = jest.fn();  
    const { getByPlaceholderText, getByRole } = render(<AddTodoForm addTodo={addTodo} />);  

    const input = getByPlaceholderText('ajouter une nouvelle tâche');
    const button = getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);

    expect(input.value).toBe('');
  });
});

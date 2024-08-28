// frontend/src/services/__tests__/api.test.js

import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../api';

global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('getAllTodos should send a GET request to /api/todos', async () => {
    const mockResponse = [{ id: 1, text: 'Test Todo' }];
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const todos = await getAllTodos();

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/todos');
    expect(todos).toEqual(mockResponse);
  });

  it('createTodo should send a POST request with the correct body', async () => {
    const newTodo = { id: 2, text: 'New Todo' };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(newTodo),
    });

    const result = await createTodo('New Todo');

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'New Todo' }),
    });
    expect(result).toEqual(newTodo);
  });

  it('updateTodo should send a PUT request with the correct ID and updates', async () => {
    const updatedTodo = { id: 1, text: 'Updated Todo' };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(updatedTodo),
    });

    const result = await updateTodo(1, { text: 'Updated Todo' });

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/todos/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Updated Todo' }),
    });
    expect(result).toEqual(updatedTodo);
  });

  it('deleteTodo should send a DELETE request with the correct ID', async () => {
    fetch.mockResolvedValueOnce({});

    await deleteTodo(1);

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/todos/1', {
      method: 'DELETE',
    });
  });
});
